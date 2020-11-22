from django.db import models
from django.conf import settings
from items.models import Item

# Create your models here.

class MissionCategory(models.Model):
    name = models.CharField(max_length=200)

class Mission(models.Model):
    mission_category = models.ForeignKey(MissionCategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField()
    body_title = models.TextField()
    body_category = models.TextField()