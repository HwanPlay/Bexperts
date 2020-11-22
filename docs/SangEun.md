

## 2020. 10. 15.

### 아이디어 회의

#### 1.싸피 커뮤니티 + 취업 커뮤니티(취업후기 스펙 등등을 상세히 익명으로 공유)

- 취업정보나눔 →싸피사람들의 스펙
- 검색어로 노출이 될 수 있을까?
- 싸피보안문제
- jobssafy
- 크롬익스텐션을 이용해 에듀싸피페이지에 커뮤니티를 접속할수 있게 한다면 접근성 향상 가능
- 싸피 로그인 DB가없음

#### 2.대입 버전의 자소설닷컴

- 4대시험이다 → 사용자가많다
- 현실사용자가 없음 → 고3은 다들 10년전임

#### 3.유,소년기 앨범(육아앨범)

- 위의 강규내용과 비슷
- 페북에서 1년전 오늘 기능 같은것
- 어머니한테 다들 인터뷰 해야할듯 → 쌉가능

#### 4.정신건강 컨텐츠

- 아이템 자체는 좋음
- 현대인의 정신건강은 심각함
- 정신과 상담이 두려움
- 익명성 - 매우중요
- 정신과 선생님과 음성통화(?)



## 2020. 10. 20.

SR프로젝트가 빨리 끝났으면 좋겠다.



## 2020. 10. 22.

### ER Diagram추가

PK는 **bold**, FK는 ***Italic***

#### 1.User Table

- **User ID** : Google Social Login 기능을 통해 Email을 확보할 예정(starseek34@gmail.com)
- Name : User의 이름(배상은)
- Money : User가 가지고 있는 돈, 재화(550)
- Theme : 유저가 가지고 있는 농장의 테마(1, 2, 3 ..)

#### 2.Item Category

- **Category ID** : Category의 ID(1, 2, 3 ...)
- Name : Category의 이름(나무, 새, 식물, 물고기 등)

#### 3.Item

- **Item ID** : Item의 ID(1, 2, 3 ...)
- ***Category ID*** : Item을 Category로 분류하고 그에 해당하는 Category의 ID를 FK로 가진다
- Name : Item의 이름
- Sell_Price : 상점에서 팔 때의 가격
- Buy_Price : 상점에서 살 때의 가격
- Image_dir : 해당 Item의 클라이언트 내 이미지의 경로
- IsInShop : 해당 Item이 상점에 판매하는지 여부를 Bool로 나타냄

#### 4.MyItem(User-Item)

User Table과 Item Table의 N : M 관계에서 탄생하는 Table

- **MyItem ID** : 내가 가진 Item의 ID
- ***User ID*** : 이 아이템을 가진 유저의 ID
- ***Item ID*** : 이 아이템이 어떤 아이템인지 나타내는 ID
- ***Category ID*** : 이 아이팀의 카테고리를 나타내는 ID
- IsInFarm : 농장에 배치되어있는지를 나타낸다. (T - 농장, F - 인벤토리)
- location : 해당 아이템의 농장 / 인벤토리 내 위치 (5*5 셀에서 몇번째를 차지하는가?)

#### 5.Mission Category

- **Mission Category ID** : 미션 카테고리의 ID
- Name : 해당 미션 카테고리의 이름(이미지 캡셔닝 / GPS / 이미지 캡셔닝 + GPS 등)

#### 6.Mission

- **Mission ID** : 미션의 ID
- ***Mission Category ID*** : 해당 미션의 카테고리의 ID
- Name : 해당 미션의 이름(벤치 찍기)
- Content : 해당 미션의 내용(주변 벤치의 사진을 찍어주세요!)

#### 7.MyMission(User-Mission)

User Table과 Mission Table과 Item Table의 Ternary 관계

- **MyMissionID** : 내가 가지고있는 미션의 ID값
- ***USER ID*** : 해당 미션이 제공되고 있는 유저의 ID
- ***Mission ID*** : 해당 미션의 ID
- ***Mission Category ID*** : 해당 미션의 카테고리의 ID
- ***Item ID*** : 해당 미션을 수행하고 클리어했을 시 주어지는 보상 Item의 ID
- ***Item Category ID*** : 해당 미션을 클리어했을 시 주어지는 보상 Item의 Category의 ID
- IsCleared : 해당 미션이 클리어되었는지 나타내는 값(T - 클리어 / F - 아직 클리어 못함)



## 2020. 11. 09.

### Backend API

해설

도메인주소는 h5태그로 표시

메서드는 그 아래쪽에 넣어놨음(get, post, put, delete)

#### 1.아이템 관련 요청

##### 1. /item/

- get : DB내 모든 아이템들의 정보를 불러온다

- post : DB에 새로운 아이템을 생성한다.

- ```json
  {
      "itemcategory": itemCategoryID(int, Foreign Key),
      "name": "name",
      "sell_price": 100,
      "buy_price": 300,
  }
  ```

##### 2. /item/<int: item_pk>/

- get : 해당 pk를 가진 아이템의 정보 조회
- put : 해당 pk를 가진 아이템의 정보를 update 한다(1번의 body양식과 같으나 필요한 부분만 넣으면된다 ==> sell_price만 업데이트시 body에 sell_price만 보내면 된다)
- delete : 해당 pk를 가진 아이템을 DB에서 삭제한다, body 필요없음

##### 3. /item/category/

- get : DB내 모든 아이템 카테고리 정보를 불러온다

- post : DB에 새로운 아이템 카테고리를 생성한다

- ```json
  {
      "name": "Flower"
  }
  ```



#### 2.미션 관련 요청

##### 1. /mission/

- get : 모든 DB내 미션들을 조회한다.

- post : DB에 새로운 미션을 생성한다

- ```json
  {
      "mission_category": MissionCategoryID(int, Foreign Key),
      "name": "나무 촬영",
      "description" : "근처 나무를 촬영하자!"
  }
  ```

##### 2. /mission/category/

- get : 모든 DB 내 미션 카테고리를 조회한다.

- post : 새로운 미션 카테고리를 만든다.

- ```json
  {
      "name": "Image Detection"
  }
  ```

##### 3. /mission/<int: mission_pk>/

- get : 해당 pk의 미션 내용을 조회한다
- put : 해당 pk의 미션 내용을 update 한다. (1번 양식과 같으나 update 필요한 필드만 보낼것)
- delete : 해당 pk의 미션을 삭제한다



#### 3.계정 관련

##### 1. /account/create/

- get : DB 내 모든 유저들을 조회한다.

- post : 계정생성

- ```json
  {
      "email": "ssafy@ssafy.com",
      "username": "ssafy",
      "password": "1234"
  }
  ```

##### 2. /account/login/

- ```json
  {
      "email": "ssafy@ssafy.com",
      "password": "1234"
  }
  ```



#### 4.내 아이템 관련

##### 1.  /account/myitem/

- get : 내가 가진 모든 아이템을 조회한다
- post : 내 인벤토리에 아이템을 추가한다

- ```json
  {
      "item": ItemID(int, Foreign Key),
      "isinfarm": False,  // True이면 필드 배치, False이면 인벤토리
      "quantity": 1, // 여러개를 한번에 구매할때 넣어줘야할 변수
      "location": 8  // 해당 아이템의 위치
  }
  ```

##### 2. /account/myitem/<int: myitem_pk>/

- get : 해당 pk의 내 아이템의 정보를 조회한다
- put : 해당 pk의 내 아이템의 정보를 update한다. body는 1번과 같은 형태로 넣어주되 필요한 필드만 넣어주면 된다
- delete : 해당 pk를 가진 아이템을 내 인벤토리(필드)에서 삭제한다 ==> 아이템을 전부 다 파는 경우에 사용하면 될듯, body 필요없음

##### 3. /account/myitem/exchange/

- put : 해당 pk를 가진 내 아이템 2개의 위치를 교환한다

- ```json
  {
      "item1_id": 17,
      "item2_id": 18
  }
  ```



#### 5.내 미션 관련

##### 1. /account/mymission/

- get : 내가 받은 모든 미션을 조회한다.

- post : 내 미션을 새로 생성한다(Front에서 안쓰일듯?)

- ```json
  {
      "item": ItemID(int, Foreign Key),
      "mission": MissionID(int, Foreign Key),
      "user": UserID(int, Foreign Key),
      "iscleared": False // 클리어 여부
  }
  ```

##### 2. /account/mymission/<int: mymission_pk>

- get : 해당 pk에 해당하는 미션을 조회한다
- put : 미션 클리어!(body 별도 양식 필요, 미션 클리어 부분 조회 바람)
- delete : 해당 pk를 가진 미션을 제거한다.



## 2020. 11. 11.

### DJango Cron // periodical Service

#### 1.Install Django-crontab

```bash
pip install django-crontab
```



#### 2.in settings.py

```python
# settings.py

INSTALLED_APPS = [
    ...
    'django_crontab',
    ...
]

CRONJOBS = [
    ('* * * * *', 'APP_NAME.FILE_NAME.FUNCTION_NAME')
]
```



#### 3.in your new File(cron)

```python
# accounts.cron.py

def periodically_do():
    ...
    ...
    ...
```



#### 4.install cron in your linux

```bash
apt-get insatll cron
```



#### 5.Add your cron job

```bash
python manage.py crontab add  # add your cron job to scheduller, not excute
python manage.py crontab show # show your cron job,
python manage.py crontab remove # remove your cron job
```



#### 6.start your cron job

```bash
service cron start  # start your cron job in your scheduller
service cron stop # stop your cron job
```



## 2020. 11. 13

### API update

buy Item, Sell Item, get 3 missions when you sign up, mission clear

#### 1.Shop

##### /account/shop/

- post : 상점에 있는 물품을 구매한다!

```json
{
    "qauntity": 3,
    "location": 4,
    "item": ItemID(Foreign Key, int),
    "gold": 50 (구매 후 남은 골드)
}
```

- delete : 상점에 물품을 판매한다!

```json
{
    "myitem_pk": MyItemPk(Foreign Key, int),
    "gold": 100 (판매 후 내 골드)
}
```



#### 2.미션 클리어

#####  /account/mymission/<int: mymission_pk>

- put

```json
{
    "location": 2
}
```



