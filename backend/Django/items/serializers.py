from rest_framework import serializers
from .models import ItemCategory, Item

class ItemSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        item = Item.objects.create(
            itemcategory = validated_data['itemcategory'],
            name = validated_data['name'],
            sell_price = validated_data['sell_price'],
            buy_price = validated_data['buy_price'],
            image_dir = validated_data['image_dir'],
            isinshop = validated_data['isinshop']
        )
        return item

    class Meta:
        model = Item
        fields = '__all__'

class ItemCategorySerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)   
    def create(self, validated_data):
        category = ItemCategory.objects.create(
            name = validated_data['name']
        )
        return category
    
    class Meta:
        model = ItemCategory
        fields = ['id', 'name', 'items']