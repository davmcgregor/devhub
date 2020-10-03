CREATE DATABASE devhub;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id uuid DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_avatar VARCHAR(255),
    registered_at timestamptz DEFAULT Now(),
    PRIMARY KEY(user_id)
);

CREATE TABLE profiles (
    profile_id SERIAL,
    profile_user_id uuid NOT NULL,
    profile_company VARCHAR(255),
    profile_website VARCHAR(255),
    profile_location VARCHAR(255),
    profile_status VARCHAR(255),
    profile_skills VARCHAR(255)[],
    profile_bio VARCHAR(255),
    profile_githubusername VARCHAR(255),
    profile_social jsonb,
    profile_date timestamptz DEFAULT Now(),
    PRIMARY KEY(profile_id),
    FOREIGN KEY (profile_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX user_unique_idx on profiles (profile_user_id);

CREATE TABLE experiences (
    experience_id SERIAL,
    experience_user_id uuid NOT NULL,
    experience_title VARCHAR(255),
	experience_company VARCHAR(255),
	experience_location VARCHAR(255),
	experience_from VARCHAR(255),
    experence_to VARCHAR(255),
	experience_current BOOLEAN,
	experience_description TEXT,
    PRIMARY KEY(experience_id),
    FOREIGN KEY (experience_user_id) REFERENCES profiles(profile_user_id) ON DELETE CASCADE
);

CREATE TABLE educations (
    education_id SERIAL,
    education_user_id uuid NOT NULL,
    education_school VARCHAR(255),
	education_degree VARCHAR(255),
	education_fieldofstudy VARCHAR(255),
	education_from VARCHAR(255),
    education_to VARCHAR(255),
	education_current BOOLEAN,
	education_description TEXT,
    PRIMARY KEY(education_id),
    FOREIGN KEY (education_user_id) REFERENCES profiles(profile_user_id) ON DELETE CASCADE
);

CREATE TABLE posts (
    post_id SERIAL,
    post_user_id uuid NOT NULL,
    post_text TEXT,
    post_avatar VARCHAR(255),
    post_created_at timestamptz DEFAULT Now(),
    PRIMARY KEY(post_id),
    FOREIGN KEY (post_user_id) REFERENCES users(user_id)
);

CREATE TABLE likes (
    like_id SERIAL,
    like_user_id uuid NOT NULL,
    like_post_id INT NOT NULL,
    PRIMARY KEY(like_id),
    FOREIGN KEY (like_user_id) REFERENCES users(user_id),
    FOREIGN KEY (like_post_id) REFERENCES posts(post_id)
);

CREATE UNIQUE INDEX user_post_idx on likes (like_user_id, like_post_id);

CREATE TABLE comments (
    comment_id SERIAL,
    comment_user_id uuid NOT NULL,
    comment_post_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    comment_created_at timestamptz DEFAULT Now(),
    PRIMARY KEY(comment_id),
    FOREIGN KEY (comment_user_id) REFERENCES users(user_id),
    FOREIGN KEY (comment_post_id) REFERENCES posts(post_id)
);
