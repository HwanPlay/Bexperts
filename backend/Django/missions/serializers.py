from rest_framework import serializers
from .models import MissionCategory, Mission as MissionModel

class MissionSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        mission = MissionModel.objects.create(
            mission_category = validated_data['mission_category'],
            name = validated_data['name'],
            description = validated_data['description']
        )
        return mission
    
    class Meta:
        model = MissionModel
        fields = '__all__'

class MissionCategorySerializer(serializers.ModelSerializer):
    missions = MissionSerializer(many=True, read_only=True)
    def create(self, validated_data):
        category = MissionCategory.objects.create(
            name = validated_data['name'] 
        )
        return category
    
    class Meta:
        model = MissionCategory
        fields = ['id', 'name', 'missions']