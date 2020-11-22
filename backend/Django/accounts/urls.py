from django.urls import path
from . import views


urlpatterns = [
    path('create/', views.createUser),
    path('login/', views.login),
    path('gold/',views.Gold.as_view()),
    path('myitem/', views.MyItem.as_view()),
    path('myitem/<int:item_pk>/', views.MyItemDetail.as_view()),
    path('myitem/exchange/', views.Exchange.as_view()),
    path('mymission/', views.MyMission.as_view()),
    path('mymission/<int:mymission_pk>/', views.MyMissionDetail.as_view()),
    path('shop/', views.Shop.as_view()),
]