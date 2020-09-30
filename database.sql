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
    user_id uuid NOT NULL,
    profile_company VARCHAR(255),
    profile_website VARCHAR(255),
    profile_location VARCHAR(255),
    profile_status VARCHAR(255),
    profile_skills VARCHAR(255)[],
    profile_bio VARCHAR(255),
    profile_githubusername VARCHAR(255),
    profile_date timestamptz DEFAULT Now(),
    PRIMARY KEY(profile_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;
);

CREATE UNIQUE INDEX user_unique_idx on profiles (user_id);

CREATE TABLE experiences (
    experience_id SERIAL,
    profile_id INT NOT NULL,
    experience_title: VARCHAR(255),
	experience_company VARCHAR(255),
	experience_location VARCHAR(255),
	experience_from VARCHAR(255),
    experence_to VARCHAR(255),
	experience_current BOOLEAN,
	experience_description TEXT,
    PRIMARY KEY(experience_id),
    FOREIGN KEY (profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE;
);



