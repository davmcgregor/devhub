CREATE DATABASE devhub;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    registered_at timestamptz DEFAULT Now(),
    PRIMARY KEY(id)
);

CREATE TABLE profiles (
    id SERIAL,
    user_id uuid NOT NULL,
    company VARCHAR(255),
    website VARCHAR(255),
    location VARCHAR(255),
    status VARCHAR(255),
    skills VARCHAR(255)[],
    bio VARCHAR(255),
    githubusername VARCHAR(255),
    social jsonb,
    edited_at timestamptz DEFAULT Now(),
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX user_unique_idx on profiles (user_id);

CREATE TABLE experiences (
    id SERIAL,
    user_id uuid NOT NULL,
    title VARCHAR(255),
	company VARCHAR(255),
	location VARCHAR(255),
	exp_from VARCHAR(255),
    exp_to VARCHAR(255),
	current BOOLEAN,
	description TEXT,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

CREATE TABLE educations (
    id SERIAL,
    user_id uuid NOT NULL,
    school VARCHAR(255),
	degree VARCHAR(255),
	fieldofstudy VARCHAR(255),
	edu_from VARCHAR(255),
    edu_to VARCHAR(255),
	current BOOLEAN,
	description TEXT,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

CREATE TABLE posts (
    id SERIAL,
    user_id uuid NOT NULL,
    text TEXT,
    avatar VARCHAR(255),
    name VARCHAR(255),
    created_at timestamptz DEFAULT Now(),
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE likes (
    id SERIAL,
    user_id uuid NOT NULL,
    post_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX user_post_idx on likes (user_id, post_id);

CREATE TABLE comments (
    id SERIAL,
    user_id uuid NOT NULL,
    post_id INT NOT NULL,
    text TEXT NOT NULL,
    avatar VARCHAR(255),
    name VARCHAR(255),
    created_at timestamptz DEFAULT Now(),
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
