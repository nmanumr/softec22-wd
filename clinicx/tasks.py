import logging
import re

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives


@shared_task
def send_mail(subject, recipients, body_html=None, body_text=None, sender=None, fail_silently=True):
    if not body_text:
        if not body_html:
            body_text = '(empty)'
        else:
            body_text = 'Please have a look over HTML Alternative Content'

    if isinstance(recipients, str):
        recipients = [recipients]

    # Email subject *must not* contain newlines
    subject = re.sub(r'\r?\n', ' ', subject).strip()
    subject = re.sub(r'\s+', ' ', subject)
    email_message = EmailMultiAlternatives(
        subject=subject,
        body=body_text,
        from_email=sender or settings.DEFAULT_FROM_EMAIL,
        to=recipients
    )

    if body_html:
        email_message.attach_alternative(body_html, 'text/html')

    try:
        email_message.send()
    except Exception:
        if not fail_silently:
            raise

        logging.exception(f'Failed to send email to {recipients}')
