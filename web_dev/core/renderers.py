from collections import OrderedDict
from typing import Any

from rest_framework.renderers import JSONRenderer
from rest_framework.utils.encoders import JSONEncoder

from spa.utils.strings import underscore_to_camel


def to_camel_case(data: Any):
    if isinstance(data, dict):
        new_dict = OrderedDict()
        for key, value in data.items():
            if not isinstance(key, str):
                key = str(key)

            new_key = underscore_to_camel(key)
            new_dict[new_key] = to_camel_case(value)
        return new_dict

    if isinstance(data, (list, tuple)):
        data = list(data) if isinstance(data, tuple) else data
        for i in range(len(data)):
            data[i] = to_camel_case(data[i])
        return data

    return data


class JavaScriptObjectEncoder(JSONEncoder):
    def default(self, o):
        if hasattr(o, '__json__'):
            return to_camel_case(o.__json__())

        return super().default(o)


class CamelCaseJSONRenderer(JSONRenderer):
    encoder_class = JavaScriptObjectEncoder

    def render(self, data, *args, **kwargs):
        return super().render(to_camel_case(data), *args, **kwargs)
