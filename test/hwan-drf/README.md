# docker-compose 를 통한 환경 구축

## docker-compose 명령어

1. django: backend(port 8000)
    아래 순서대로 실행할 것
  ```bash
  docker-compose up db
  docker-compose up backend
  ```

2. adminer: DB를 brower로 관리할 때(port 8080)

```bash
docker-compose up adminer
```

​	

docker ps

docker exec -it {container id} bash

