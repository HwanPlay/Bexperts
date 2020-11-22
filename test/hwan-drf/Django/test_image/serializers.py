from rest_framework import serializers
from .models import Image

# ModelSerializer 뒤에서 설명합니다.
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('title', 'image', 'isTrue')