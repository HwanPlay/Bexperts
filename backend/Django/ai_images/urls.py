from django.urls import path, include
from . import views

app_name = 'ai_images'

urlpatterns = [
   path('predict/', views.predict),
]