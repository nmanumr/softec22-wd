import re
import uuid

from django.db import models, transaction, IntegrityError


class PublicModel(models.Model):
    public_id = models.UUIDField(unique=True, editable=False)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if self.public_id:
            return super().save(*args, **kwargs)

        self.public_id = uuid.uuid4()
        while True:
            try:
                with transaction.atomic():
                    return super().save(*args, **kwargs)
            except IntegrityError as ex:
                pattern = fr'Key\s+\(public_id\)=\({re.escape(str(self.public_id))}\) already exists.'

                if not re.findall(pattern, str(ex)):
                    raise

                self.public_id = uuid.uuid4()
