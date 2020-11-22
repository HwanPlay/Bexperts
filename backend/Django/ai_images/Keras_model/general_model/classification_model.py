import keras
import cv2
import numpy as np 
import MM

reconstructed_model = keras.models.load_model("/code/ai_images/Keras_model/general_model/general.h5")
def check_general(request, target):
  # import 학습 model
  
  # request에서 들어온 image 변환, 사이즈 input에 맞게 변환
  try:
    img = cv2.imdecode(np.fromstring(request.FILES['image'].read(), np.uint8), cv2.IMREAD_COLOR)
  except Exception as e:
    MM.send(e, '\nimage files 확인 필요', "ai-images/predict/")

  shape = (32, 32)
  img = cv2.resize(img,shape)
  img = np.array([img])
  img = img.astype('float32')/255
  # 결과값 바탕으로 T/F 반환
  output = { 0:'car', 1:'cat', 2:'dog', 3:'flower', 4:'motorbike', 5:'person'}
  predict = (reconstructed_model.predict(img) > 0.5).astype("int32")
  try:
    result = output[np.argmax(predict[0])]
  except Exception as e:
    MM.send(e, '\n AI detection 불가', "ai-images/predict/")
  return result == target