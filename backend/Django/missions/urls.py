from django.urls import path
from . import views

urlpatterns = [
    path('', views.Mission.as_view()),
    path('category/', views.Category.as_view()),
    path('<int:mission_pk>/', views.MissionDetail.as_view()),
]