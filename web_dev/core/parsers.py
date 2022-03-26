import json
from typing import Any

from django.conf import settings
from rest_framework.parsers import JSONParser, ParseError

from spa.utils.strings import camel_to_underscore


def to_snake_case(data: Any) -> Any:
    if isinstance(data, dict):
        new_dict = {}
        for key, value in data.items():
            new_key = camel_to_underscore(key)
            new_dict[new_key] = to_snake_case(value)
        return new_dict

    if isinstance(data, (list, tuple)):
        for i in range(len(data)):
            data[i] = to_snake_case(data[i])
        return data

    return data


class CamelCaseJSONParser(JSONParser):
    def parse(self, stream, media_type=None, parser_context=None):
        parser_context = parser_context or {}
        encoding = parser_context.get('encoding', settings.DEFAULT_CHARSET)

        try:
            data = stream.read().decode(encoding)
            return to_snake_case(json.loads(data))
        except ValueError as exc:
            raise ParseError(f'JSON parse error: {str(exc)}')
