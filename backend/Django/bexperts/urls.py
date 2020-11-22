from django.contrib import admin
from django.urls import path, include

#swagger
from .swagger import schema_view
from django.conf.urls import url

urlpatterns = [
    path('admin/', admin.site.urls),
    path('account/', include('accounts.urls')),
    path('item/', include('items.urls')),
    path('mission/', include('missions.urls')),
    path('ai-images/', include('ai_images.urls')),
    #swagger
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
