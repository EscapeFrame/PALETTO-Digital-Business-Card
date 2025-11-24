# Docker Compose로 MySQL 환경 관리

## 사전 준비

Docker Desktop이 설치되어 있어야 합니다.
- [Docker Desktop for Mac 다운로드](https://www.docker.com/products/docker-desktop)

## 환경 설정

1. `.env` 파일 생성 (이미 생성되어 있으면 건너뛰기):
```bash
cp .env.example .env
```

2. 필요시 `.env` 파일에서 데이터베이스 설정 수정

## 사용 방법

### MySQL 컨테이너 시작
```bash
npm run docker:up
# 또는
docker-compose up -d
```

### MySQL 컨테이너 중지
```bash
npm run docker:down
# 또는
docker-compose down
```

### MySQL 로그 확인
```bash
npm run docker:logs
# 또는
docker-compose logs -f mysql
```

### MySQL 컨테이너 재시작
```bash
npm run docker:restart
# 또는
docker-compose restart mysql
```

### 데이터베이스 초기화

MySQL 컨테이너가 처음 시작될 때 `schema.sql` 파일이 자동으로 실행됩니다.

### MySQL 컨테이너에 직접 접속
```bash
docker exec -it paletto_mysql mysql -u paletto_user -p
# 비밀번호: paletto_password (또는 .env에 설정한 비밀번호)
```

### 데이터베이스 백업
```bash
docker exec paletto_mysql mysqldump -u paletto_user -ppaletto_password paletto_cards > backup.sql
```

### 데이터베이스 복원
```bash
docker exec -i paletto_mysql mysql -u paletto_user -ppaletto_password paletto_cards < backup.sql
```

## 개발 워크플로우

1. MySQL 컨테이너 시작:
```bash
npm run docker:up
```

2. Next.js 개발 서버 시작:
```bash
npm run dev
```

3. 애플리케이션 접속: http://localhost:3000

## 데이터 영속성

MySQL 데이터는 Docker 볼륨(`mysql_data`)에 저장되므로 컨테이너를 중지하고 다시 시작해도 데이터가 유지됩니다.

### 데이터 완전 삭제 (주의!)
```bash
docker-compose down -v
```

## 문제 해결

### 포트 충돌
이미 로컬에서 MySQL이 실행 중이면 포트 충돌이 발생할 수 있습니다.
- `.env` 파일에서 `DB_PORT`를 다른 포트(예: 3307)로 변경
- 또는 로컬 MySQL 중지

### 컨테이너 상태 확인
```bash
docker-compose ps
```

### 컨테이너 헬스체크
```bash
docker inspect paletto_mysql | grep -A 10 Health
```
