from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('items/', include('items.urls')),
    path('missions/', include('missions.urls')),


]
