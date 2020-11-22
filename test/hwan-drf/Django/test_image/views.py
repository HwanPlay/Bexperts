from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Image
from .serializers import ImageSerializer

from Keras_model.fruit_model import classification

@api_view(['POST'])
def ImageAPI(request):  
  print('------------')  
  print(request.GET['id'])
  now_person = Image.objects.get(id=1)
  fruit_object = classification.qwnkld()
  print(classification.qwnkld())
  # if fruit_object == '바나나':
  #   print('-----yes-------')
  print(now_person)
  # .get(id=request.POST['id'])
  serializer = ImageSerializer(now_person)
  print(serializer.data)
  real = serializer.data
  real['isTrue'] = True
  print(serializer.data.get('isTrue'))
  print(real)
  return Response(real)

  # image = Image()
  # image.title = request.POST['title']
  # image.isTrue = False
  # serializer = ImageSerializer(title)
  # return Response(serializer.data)