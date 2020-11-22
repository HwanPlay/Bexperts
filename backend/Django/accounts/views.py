from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .serializers import UserCreateSerializer, UserLoginSerializer, UserSerializer, MyItemSerializer, MyMissionSerializer
from .models import User, MyItem as MyItemModel, MyMission as MyMissionModel
from items.models import Item as ItemModel
from missions.models import Mission as MissionModel

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def createUser(request):
    '''
    create User
    /return => message : Success or Fail(Error)
    '''
    if request.method == 'POST':
        serializer = UserCreateSerializer(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response({"message": "Request Body Error."}, status=status.HTTP_409_CONFLICT)
        if User.objects.filter(email=serializer.validated_data['email']).first() is None:
            obj = serializer.save()
            new_user = get_object_or_404(User, id=obj.id)
            for i in range(2, 5):
                item_info = get_object_or_404(ItemModel, pk=i)
                mission_info = get_object_or_404(MissionModel, pk=i)
                tmp = {"iscleared": False}
                mission_serializer = MyMissionSerializer(data=tmp)
                if mission_serializer.is_valid(raise_exception=True):
                    mission_serializer.save(user=new_user, mission=mission_info, item=item_info)
            return Response({"message": obj.id}, status=status.HTTP_201_CREATED)
        return Response({"message": "duplicate email"}, status=status.HTTP_409_CONFLICT)
    else:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    '''
    Login User
    /return => JWT Token in Success or message : Fail(Login Error)
    '''
    if request.method == 'POST':
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response({"message": "Request Body Error."}, status=status.HTTP_409_CONFLICT)
        if serializer.validated_data['email'] == "None":
            return Response({'message': 'fail'}, status=status.HTTP_200_OK)

        response = {
            'success': 'True',
            'token': serializer.data['token']
        }
        return Response(response, status=status.HTTP_200_OK)

class Gold(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        '''
        get your(user's) gold
        /return => {gold : yourgold(int)}
        '''
        user = get_object_or_404(User, email=request.user.email)
        info = {'gold': user.gold }
        return Response(info, status=status.HTTP_200_OK)

    def put(self, request):
        '''
        change your gold after calculating
        /return => {gold : yourgold(int, after calculating)}
        '''
        user = get_object_or_404(User, email=request.user.email)
        user.gold = int(request.data['gold'])
        user.save()
        info = {'gold': user.gold}
        return Response(info, status=status.HTTP_200_OK)

class MyItem(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        '''
        get your(user's) Item list
        /return => your item's list
        '''
        myitems = MyItemModel.objects.filter(user=request.user)
        serializer = MyItemSerializer(myitems, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        '''
        create your Item
        /return => message : Item's information or Fail Message
        '''
        n = int(request.data['quantity'])
        loc = request.data['location']
        request.data["location"] = 1
        item_info = get_object_or_404(ItemModel, pk=int(request.data['item']))
        ret = {}
        for i in range(n):
            serializer = MyItemSerializer(data=request.data)
            if not serializer.is_valid(raise_exception=True):
                return Response({"message": "Please Check Item's Contex"})
            serializer.save(user=request.user, location=int(loc[i]), item=item_info, quantity=1)
            ret[i] = serializer.data
        return Response(ret, status=status.HTTP_201_CREATED)

class MyItemDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, item_pk):
        '''
        get your single item's information
        '''
        myitem = get_object_or_404(MyItemModel, pk=item_pk)
        serializer = MyItemSerializer(myitem)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, item_pk):
        '''
        update your item's information
        /return => Item's Information or Fail Message
        '''
        myitem = get_object_or_404(MyItemModel, pk=item_pk)
        serializer = MyItemSerializer(myitem, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "Please Check Item's Context"}, status=status.HTTP_409_CONFLICT)

    def delete(self, request, item_pk):
        '''
        delete your item
        /return => Success or Fail
        '''
        myitem = get_object_or_404(MyItemModel, pk=item_pk)
        myitem.delete()
        return Response({"message": "Successfully delete item"}, status=status.HTTP_200_OK)

class MyMission(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        mymissions = MyMissionModel.objects.filter(user=request.user)
        serializer = MyMissionSerializer(mymissions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        item_info = get_object_or_404(ItemModel, pk=int(request.data['item']))
        mission_info = get_object_or_404(MissionModel, pk=int(request.data['mission']))
        serializer = MyMissionSerializer(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response({"message": "please check my mission's context"})
        serializer.save(user=request.user, mission=mission_info, item=item_info)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MyMissionDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, mymission_pk):
        mymission = get_object_or_404(MyMissionModel, pk=mymission_pk)
        serializer = MyMissionSerializer(mymission)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, mymission_pk):
        '''
        mission Clear!
        '''
        mymission = get_object_or_404(MyMissionModel, pk=mymission_pk)
        mymission.iscleared = True
        mymission.save()
        item_info = get_object_or_404(ItemModel, pk=int(mymission.item.id))
        tmp = { "isinfarm":False, "location":int(request.data['location']), "quantity": 1}
        serializer = MyItemSerializer(data=tmp)
        if not serializer.is_valid(raise_exception=True):
            return Response({"message": "Please Check Item's Contex"})
        serializer.save(user=request.user, item=item_info)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, mymission_pk):
        mymission = get_object_or_404(MyMissionModel, pk=mymission_pk)
        mymission.delete()
        return Response({"message": "Successfully delete mission"}, status=status.HTTP_200_OK)

class Exchange(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        item1 = get_object_or_404(MyItemModel, pk=int(request.data['item_id1']))
        item2 = get_object_or_404(MyItemModel, pk=int(request.data['item_id2']))
        
        loc1 = item1.location
        loc2 = item2.location

        item1.location = loc2
        item1.save()
        item2.location = loc1
        item2.save()

        return Response({"message": "two item's location was exchanged"}, status=status.HTTP_200_OK)
    
class Shop(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        '''
        buy
        '''
        n = int(request.data['quantity'])
        loc = request.data['location']
        request.data["location"] = 1
        item_info = get_object_or_404(ItemModel, pk=int(request.data['item']))
        ret = {}
        for i in range(n):
            serializer = MyItemSerializer(data=request.data)
            if not serializer.is_valid(raise_exception=True):
                return Response({"message": "Please Check Item's Contex"})
            serializer.save(user = request.user, location=int(loc[i]), item=item_info, quantity=1)
            ret[i] = serializer.data
        user = get_object_or_404(User, email=request.user.email)
        user.gold = int(request.data['gold'])
        user.save()
        return Response(ret, status=status.HTTP_201_CREATED)
    
    def delete(self, request):
        '''
        sell
        '''
        myitem = get_object_or_404(MyItemModel, pk=int(request.data['myitem_pk']))
        myitem.delete()
        user = get_object_or_404(User, email=request.user.email)
        user.gold = int(request.data['gold'])
        user.save()
        return Response({"message": "Successfully Sell item"}, status=status.HTTP_200_OK)