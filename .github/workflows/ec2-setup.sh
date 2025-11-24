#!/bin/bash

# EC2 초기 설정 스크립트
# 이 스크립트를 EC2 인스턴스에서 실행하세요

set -e

echo "========================================="
echo "PALETTO Business Card EC2 초기 설정"
echo "========================================="

# 시스템 업데이트
echo "1. 시스템 업데이트 중..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Node.js 18.x 설치
echo "2. Node.js 18.x 설치 중..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Node.js 버전 확인
echo "Node.js 버전:"
node -v
echo "npm 버전:"
npm -v

# PM2 설치
echo "3. PM2 설치 중..."
sudo npm install -g pm2

# Docker 설치
echo "4. Docker 설치 중..."
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Docker Compose 설치
echo "5. Docker Compose 설치 중..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 애플리케이션 디렉토리 생성
echo "6. 애플리케이션 디렉토리 생성 중..."
mkdir -p /home/$USER/palettobusinesscard
cd /home/$USER/palettobusinesscard

# .env 파일 생성
echo "7. .env 파일 생성..."
cat > .env << 'EOF'
DB_HOST=localhost
DB_PORT=3306
DB_USER=paletto_user
DB_PASSWORD=paletto_password
DB_ROOT_PASSWORD=paletto_root_password
DB_NAME=paletto_cards
ADMIN_PASSWORD=paletto2024
EOF

echo "========================================="
echo "초기 설정 완료!"
echo "========================================="
echo ""
echo "다음 단계:"
echo "1. .env 파일을 수정하여 보안 비밀번호를 설정하세요:"
echo "   nano /home/$USER/palettobusinesscard/.env"
echo ""
echo "2. Docker 그룹 권한을 적용하기 위해 재로그인하세요:"
echo "   exit"
echo "   (다시 SSH 접속)"
echo ""
echo "3. GitHub Actions에서 자동 배포를 진행하세요"
echo "========================================="
