CREATE DATABASE mind2career;

USE mind2career;

#user table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);
select * from users;

#Profiles table
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100),
    college VARCHAR(100),
    skills TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
select * from profiles;
desc profiles;

#Quiz Score table
CREATE TABLE quiz_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_type VARCHAR(50),
    role VARCHAR(100),
    score INT,
    total_questions INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM quiz_scores;
SET SQL_SAFE_UPDATES = 0;
SHOW TABLES;