from django.utils.functional import cached_property
from user_agents import parse as parse_user_agent


class RequestIdentity:
    def __init__(self, ua_string, ip_address=None):
        self.ua_string = ua_string
        self.ip_address = ip_address

        self.user_agent = parse_user_agent(ua_string)

    @property
    def os_family(self):
        return self.user_agent.os.family

    @property
    def os_version(self):
        return self.user_agent.os.version_string

    @property
    def device_brand(self):
        return self.user_agent.device.brand

    @property
    def device_model(self):
        return self.user_agent.device.model

    @property
    def browser_family(self):
        return self.user_agent.browser.family

    @property
    def browser_version(self):
        return self.user_agent.browser.version_string

    @cached_property
    def device_type(self):
        if self.user_agent.is_pc:
            return 'desktop'

        if self.user_agent.is_tablet:
            return 'tablet'

        if self.user_agent.is_mobile:
            return 'mobile'

        if self.user_agent.is_bot:
            return 'bot'

    @classmethod
    def from_request(cls, request):
        ua_string = request.META.get('HTTP_USER_AGENT', '')
        if not ua_string:
            return

        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')

        return cls(ua_string=ua_string, ip_address=ip_address)
