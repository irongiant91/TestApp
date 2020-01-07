from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from .image import Image
import face_recognition

## Table for saving user deatils.
class FaceEncoding(models.Model):
    uid = models.AutoField(primary_key=True)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    encoding = models.BinaryField()
    image = models.ForeignKey(to=Image, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
