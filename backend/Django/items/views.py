from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Item as ItemModel, ItemCategory
from .serializers import ItemCategorySerializer, ItemSerializer

class Category(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        '''
        get Item Category list's information
        /return => item category id and item category name
        '''
        categories = ItemCategory.objects.all()
        serializer = ItemCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        '''
        create Item Category
        /return => messeage : success or Fail
        '''
        serializer = ItemCategorySerializer(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response({"message": "Please Check name"}, status=status.HTTP_409_CONFLICT)
        serializer.save()
        return Response({"message": f"new Item Category '{request.data['name']}' was created"}, status=status.HTTP_201_CREATED)

class Item(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        '''
        get all items's information
        /return => list of item's (category, name, sell_price, buy_price, image_dir, isinshop)
        '''
        items = ItemModel.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        '''
        create One Item
        /return => messeage : success or Fail
        '''
        serializer = ItemSerializer(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response({"message": "Please Check Item's Context"}, status=status.HTTP_409_CONFLICT)
        serializer.save()
        return Response({"message": f"new Item '{request.data['name']}' was created"}, status=status.HTTP_201_CREATED)
    

class ItemDetail(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, item_pk):
        '''
        get one items's information
        /return => single item's (category, name, sell_price, buy_price, image_dir, isinshop)
        '''
        item = get_object_or_404(ItemModel, pk=item_pk)
        serializer = ItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, item_pk):
        item = get_object_or_404(ItemModel, pk=item_pk)
        serializer = ItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "Please Check item's context"}, status=status.HTTP_409_CONFLICT)
    
    def delete(self, request, item_pk):
        item = get_object_or_404(ItemModel, pk=item_pk)
        item.delete()
        return Response({"message": "Successfully delete item"}, status=status.HTTP_200_OK)
        


