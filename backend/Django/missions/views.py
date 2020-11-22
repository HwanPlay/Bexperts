from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import MissionCategory, Mission as MissionModel
from .serializers import MissionCategorySerializer, MissionSerializer

class Category(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        '''
        get Mission Category list's information
        /return => mission category id and name
        '''
        categories = MissionCategory.objects.all()
        serializer = MissionCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        '''
        create Mission Category
        /return => message : Success or Fail
        '''
        serializer = MissionCategorySerializer(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response({"message": "Please Check Category Name"}, status=status.HTTP_409_CONFLICT)
        serializer.save()
        return Response({"message": f"new Mission Category '{request.data['name']}' was created"}, status=status.HTTP_201_CREATED)

class Mission(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        '''
        get all mission's information
        /return => list of mission's (category, name, description)
        '''
        missions = MissionModel.objects.all()
        serializer = MissionSerializer(missions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        '''
        create One Mission
        /return => message : Success or Fail
        '''
        serializer = MissionSerializer(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response({"message": "Please Check Mission's Context"})
        serializer.save()
        return Response({"message": f"new mission '{request.data['name']}' was created"}, status=status.HTTP_200_OK)

class MissionDetail(APIView):
    permission_classes = [AllowAny]

    def get(self, request, mission_pk):
        '''
        get one mission's information
        /return => single item's (category, name, description)
        '''
        mission = get_object_or_404(MissionModel, pk=mission_pk)
        serializer = MissionSerializer(mission)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, mission_pk):
        mission = get_object_or_404(MissionModel, pk=mission_pk)
        serializer = MissionSerializer(mission, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "Please Check Mission's Context"})
    
    def delete(self, request, mission_pk):
        mission = get_object_or_404(MissionModel, pk=mission_pk)
        mission.delete()
        return Response({"message": "Successfully Delete Mission"}, status=status.HTTP_200_OK)
