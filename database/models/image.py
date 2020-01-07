from django.db import models
from django.contrib.auth.models import User

## Table for saving iamge.
class Image(models.Model):
    path = models.ImageField(max_length=255, upload_to="images")
    is_active = models.BooleanField(default=True)