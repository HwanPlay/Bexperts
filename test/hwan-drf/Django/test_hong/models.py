from django.db import models

# Create your models here.

class Post(models.Model):
  title = models.CharField(max_length=500)
  category = models.CharField(max_length=100)
  image = models.ImageField(upload_to="post/")
  isTrue = models.BooleanField(default=False)