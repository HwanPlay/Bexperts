import random

from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from accounts.models import MyMission as MyMissionModel
from accounts.serializers import UserSerializer, MyMissionSerializer
from items.models import Item as ItemModel
from missions.models import Mission as MissionModel
User = get_user_model()

# 미션 개수 뽑아오기
# 사람들에게 줄 수 있는 아이템 뽑아오기
# 유저 명수 뽑아오기
    
def DailyUpdateMission():
    users = User.objects.all()
    missions = MissionModel.objects.all()
    items = ItemModel.objects.all()

    for n in range(len(users)):  # 해당 유저가 가지고있는 미션 3개를 삭제
        ownmission = MyMissionModel.objects.filter(user=users[n])
        for j in range(len(ownmission)):
            ownmission[j].delete()

        mission_pk_list = random.sample(range(1, len(missions)+1), 3)
        item_pk_list = random.sample(range(1, len(items)+1), 3)
        
        for j in range(3):
            mission_info = get_object_or_404(MissionModel, pk=mission_pk_list[j])
            item_info = get_object_or_404(ItemModel, pk=item_pk_list[j])
            tmp = { "iscleared": False }
            serializer = MyMissionSerializer(data=tmp)
            if not serializer.is_valid(raise_exception=True):
                return Response({"message": "Failure at Automatically update Mission"})
            serializer.save(user=users[n], mission=mission_info, item=item_info)
    
    print("Daily Mission Update was done")