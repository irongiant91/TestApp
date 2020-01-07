from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User


## Table for saving user deatils.
class Movie(models.Model):
    uid = models.AutoField(primary_key=True)
    title = models.TextField()
    year = models.TextField()
    genre = models.TextField()