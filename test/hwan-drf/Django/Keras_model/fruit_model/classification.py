import keras
import cv2
import numpy as np 

def qwnkld(request, target):
  # import 학습 model
  reconstructed_model = keras.models.load_model("/code/Keras_model/fruit_model/fruit_model")
  
  # request에서 들어온 image 변환, 사이즈 input에 맞게 변환
  img = cv2.imdecode(np.fromstring(request.FILES['image'].read(), np.uint8), cv2.IMREAD_COLOR)
  shape = (200, 200)
  img = cv2.resize(img,shape)
  img = np.array([img])
  
  # 결과값 바탕으로 T/F 반환
  output = { 0:'사과',1:'바나나',2:'mixed',3:'오렌지'}
  predict = reconstructed_model.predict(img)
  return output[np.argmax(predict)] == target