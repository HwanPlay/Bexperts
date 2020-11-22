from rest_framework.decorators import api_view
from django.http import JsonResponse

import MM

from .Keras_model.fruit_model.classification import check_fruit
from .Keras_model.general_model.classification_model import check_general

@api_view(['POST'])
def predict(request):
	result = {
		'ans': False
	}
	# category == 물건의 종류, title == 물건의 detail

	# print(request)
	# print(request.data)
	# print(request.FILES)
	# print(request.FILES['image'])
	try:
		keyword = request.data['category']
		target = request.data['title']
	except Exception as e:
		MM.send(e, '\nform-data 확인 필요',"ai-images/predict/")

		# 물건 종류에 따라 if문 model 분기
	if keyword == 'fruit':
		result['ans'] = check_fruit(request, target)
	elif keyword == 'general':
		result['ans'] = check_general(request, target)
	# test용 print문.
	
	# qwnkld(request.FILES['image'])
	return JsonResponse(result)