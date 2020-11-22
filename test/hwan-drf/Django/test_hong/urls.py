from django.urls import path, include
from . import views

app_name = 'test_hong'

urlpatterns = [
   path('test/', views.test),
]