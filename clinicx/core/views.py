import asyncio
from functools import update_wrapper

from asgiref.sync import sync_to_async
from django.http.response import HttpResponseBase
from django.utils.decorators import classonlymethod
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.generics import GenericAPIView as DrfGenericAPIView
from rest_framework.response import Response
from rest_framework.views import set_rollback


class GenericAPIView(DrfGenericAPIView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response is None:
            response = Response(status=status.HTTP_204_NO_CONTENT)
        elif not isinstance(response, HttpResponseBase):
            response = Response(response)

        return super().finalize_response(request, response, *args, **kwargs)

    def handle_exception(self, exc):
        if isinstance(exc, APIException):
            headers = {}
            auth_header = getattr(exc, 'auth_header', None)
            if auth_header:
                headers['WWW-Authenticate'] = auth_header

            wait = getattr(exc, 'wait', None)
            if wait:
                headers['Retry-After'] = '%d' % wait

            data = exc.get_full_details()
            set_rollback()
            return Response(data, status=exc.status_code, headers=headers)

        return super().handle_exception(exc)


class AsyncAPIViewMixin(GenericAPIView):
    @classonlymethod
    def as_view(cls, **initkwargs):
        """Main entry point for a request-response process."""
        for key in initkwargs:
            if key in cls.http_method_names:
                raise TypeError(
                    f'The method name {key} is not accepted as a keyword argument '
                    f'to {cls.__name__}().'
                )

            if not hasattr(cls, key):
                raise TypeError(
                    f'{cls.__name__}() received an invalid keyword {key!r}. as_view '
                    'only accepts arguments that are already '
                    'attributes of the class.'
                )

        async def view(request, *args, **kwargs):
            self = cls(**initkwargs)
            self.setup(request, *args, **kwargs)
            if not hasattr(self, 'request'):
                raise AttributeError(
                    f'{cls.__name__} instance has no "request" attribute. Did you override '
                    'setup() and forget to call super()?'
                )
            return await self.dispatch(request, *args, **kwargs)

        view.cls = cls
        view.view_class = cls
        view.initkwargs = initkwargs
        view.view_initkwargs = initkwargs

        # take name and docstring from class
        update_wrapper(view, cls, updated=())

        # Don't use decorator
        view.csrf_exempt = True
        return view

    async def dispatch(self, request, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs

        request = await sync_to_async(self.initialize_request, thread_sensitive=True)(request, *args, **kwargs)
        self.request = request
        self.headers = self.default_response_headers  # deprecate?

        try:
            await sync_to_async(self.initial, thread_sensitive=True)(request, *args, **kwargs)

            # Get the appropriate handler method
            if request.method.lower() in self.http_method_names:
                handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
            else:
                handler = self.http_method_not_allowed

            if asyncio.iscoroutinefunction(handler):
                response = await handler(request, *args, **kwargs)
            else:
                response = await sync_to_async(handler, thread_sensitive=True)(request, *args, **kwargs)
        except Exception as exc:
            response = await sync_to_async(self.handle_exception, thread_sensitive=True)(exc)

        self.response = await sync_to_async(self.finalize_response, thread_sensitive=True)(
            request, response, *args, **kwargs
        )
        return self.response


class CreateAPIViewEx(GenericAPIView):
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({}, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save()


class UpdateAPIViewEx(GenericAPIView):
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({}, status=status.HTTP_204_NO_CONTENT)

    def perform_update(self, serializer):
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
