# GitHub Actions 배포 설정

이 워크플로우는 `master` 또는 `main` 브랜치에 푸시될 때 자동으로 EC2에 배포합니다.

## 필요한 GitHub Secrets 설정

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 secrets을 추가하세요:

### EC2 연결 정보
- `EC2_HOST`: EC2 인스턴스의 퍼블릭 IP 또는 도메인
- `EC2_USER`: EC2 SSH 사용자명 (보통 `ubuntu` 또는 `ec2-user`)
- `EC2_SSH_KEY`: EC2 인스턴스 접속용 프라이빗 키 (PEM 파일 전체 내용)
- `EC2_PORT`: SSH 포트 (기본값: 22)

### 데이터베이스 설정
- `DB_HOST`: 데이터베이스 호스트 (보통 `localhost`)
- `DB_PORT`: 데이터베이스 포트 (기본값: 3306)
- `DB_USER`: 데이터베이스 사용자명
- `DB_PASSWORD`: 데이터베이스 비밀번호
- `DB_ROOT_PASSWORD`: 데이터베이스 루트 비밀번호
- `DB_NAME`: 데이터베이스 이름

### 애플리케이션 설정
- `ADMIN_PASSWORD`: 관리자 페이지 비밀번호

## EC2 서버 초기 설정

EC2 인스턴스에서 다음 명령어를 실행하여 환경을 설정하세요:

### 1. Node.js 설치
```bash
# Node.js 18.x 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. PM2 설치
```bash
sudo npm install -g pm2
```

### 3. Docker 및 Docker Compose 설치
```bash
# Docker 설치
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. 프로젝트 클론
```bash
cd /home/$USER
git clone https://github.com/EscapeFrame/PALETTO-Digital-Business-Card.git palettobusinesscard
cd palettobusinesscard
```

### 5. 환경 변수 설정
```bash
# .env 파일 생성
nano .env
```

.env 파일 내용:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=paletto_user
DB_PASSWORD=your_secure_password
DB_ROOT_PASSWORD=your_root_password
DB_NAME=paletto_cards
ADMIN_PASSWORD=your_admin_password
```

### 6. MySQL 컨테이너 시작
```bash
docker-compose up -d
```

### 7. 의존성 설치 및 빌드
```bash
npm install
npm run build
```

### 8. PM2로 애플리케이션 시작
```bash
pm2 start npm --name "paletto-business-card" -- start
pm2 save
pm2 startup
```

### 9. Nginx 설치 및 설정 (선택사항)
```bash
sudo apt-get install -y nginx

# Nginx 설정
sudo nano /etc/nginx/sites-available/paletto
```

Nginx 설정 내용:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Nginx 설정 활성화
sudo ln -s /etc/nginx/sites-available/paletto /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 배포 프로세스

1. 로컬에서 코드 변경
2. Git commit & push to master/main
3. GitHub Actions가 자동으로 실행됨
4. EC2에서 코드 업데이트 및 재시작
5. PM2가 애플리케이션을 관리

## 문제 해결

### EC2에서 로그 확인
```bash
# PM2 로그
pm2 logs paletto-business-card

# Docker 로그
docker logs paletto_mysql

# Nginx 로그
sudo tail -f /var/log/nginx/error.log
```

### 애플리케이션 재시작
```bash
cd /home/$USER/palettobusinesscard
pm2 restart paletto-business-card
```

### Docker 재시작
```bash
cd /home/$USER/palettobusinesscard
docker-compose restart
```
