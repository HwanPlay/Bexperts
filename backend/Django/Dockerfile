FROM python:3.8.6
ENV PYTHONUNBUFFERED=1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install --upgrade pip 
RUN pip install mysqlclient 
RUN pip install -r requirements.txt
COPY . /code/
RUN apt-get update
RUN apt-get install cron -y
RUN apt-get install 'ffmpeg' 'libsm6' 'libxext6'  -y