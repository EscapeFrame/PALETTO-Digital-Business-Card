-- PALETTO Digital Business Card Database Schema

CREATE DATABASE IF NOT EXISTS paletto_cards
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE paletto_cards;

-- Team Members table
CREATE TABLE IF NOT EXISTS members (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    role VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    bio TEXT NOT NULL,
    avatar VARCHAR(50) DEFAULT '👨‍💻',
    gradient_from VARCHAR(20) DEFAULT '#87CEEB',
    gradient_to VARCHAR(20) DEFAULT '#5DADE2',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(100) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    UNIQUE KEY unique_member_skill (member_id, skill_name)
);

-- Social links table
CREATE TABLE IF NOT EXISTS social_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(100) NOT NULL,
    platform ENUM('github', 'linkedin', 'twitter', 'instagram') NOT NULL,
    url VARCHAR(500) NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    UNIQUE KEY unique_member_platform (member_id, platform)
);

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL
);

-- Insert default admin password (hashed 'paletto2024')
-- You should update this with a properly hashed password
INSERT INTO admin_settings (setting_key, setting_value)
VALUES ('admin_password_hash', '$2a$10$example_hash_replace_me')
ON DUPLICATE KEY UPDATE setting_value = setting_value;

-- Sample data (optional - you can remove this)
INSERT INTO members (id, name, name_en, role, email, phone, bio, avatar, gradient_from, gradient_to) VALUES
('kim-minjun', '김민준', 'Minjun Kim', 'Team Lead & Full-Stack Developer', 'minjun@paletto.team', '+82 10-1234-5678', '사용자 경험을 최우선으로 생각하는 개발자입니다.', '👨‍💻', '#87CEEB', '#5DADE2'),
('lee-suji', '이수지', 'Suji Lee', 'UI/UX Designer', 'suji@paletto.team', '+82 10-2345-6789', '아름다움과 기능성의 조화를 추구하는 디자이너입니다.', '👩‍🎨', '#B0E0E6', '#87CEEB'),
('park-jihoon', '박지훈', 'Jihoon Park', 'Backend Developer', 'jihoon@paletto.team', '+82 10-3456-7890', '안정적이고 확장 가능한 시스템 구축을 목표로 합니다.', '👨‍🔧', '#5DADE2', '#3498DB')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO skills (member_id, skill_name) VALUES
('kim-minjun', 'React'), ('kim-minjun', 'Next.js'), ('kim-minjun', 'TypeScript'),
('lee-suji', 'Figma'), ('lee-suji', 'Adobe XD'), ('lee-suji', 'Prototyping'),
('park-jihoon', 'Python'), ('park-jihoon', 'Django'), ('park-jihoon', 'AWS')
ON DUPLICATE KEY UPDATE skill_name = VALUES(skill_name);

INSERT INTO social_links (member_id, platform, url) VALUES
('kim-minjun', 'github', 'https://github.com'),
('kim-minjun', 'linkedin', 'https://linkedin.com'),
('lee-suji', 'instagram', 'https://instagram.com'),
('park-jihoon', 'github', 'https://github.com')
ON DUPLICATE KEY UPDATE url = VALUES(url);
