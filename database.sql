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
    profile_social jsonb,
    profile_date timestamptz DEFAULT Now(),
    PRIMARY KEY(profile_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX user_unique_idx on profiles (user_id);

CREATE TABLE experiences (
    experience_id SERIAL,
    user_id uuid NOT NULL,
    experience_title VARCHAR(255),
	experience_company VARCHAR(255),
	experience_location VARCHAR(255),
	experience_from VARCHAR(255),
    experence_to VARCHAR(255),
	experience_current BOOLEAN,
	experience_description TEXT,
    PRIMARY KEY(experience_id),
    FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

/* DUMMY DATA */

INSERT INTO users (user_name, user_email, user_password, user_avatar) VALUES ('example name', 'example@gmail.com', 123456, 'http://avatar.com/example');

INSERT INTO users (user_name, user_email, user_password, user_avatar) VALUES ('example name2', 'example@gmail.com2', 123456, 'http://avatar.com/example2');

INSERT INTO profiles (user_id, profile_company, profile_website, profile_location, profile_status, profile_skills, profile_bio, profile_githubusername, profile_social) VALUES ('528257d7-917f-43f1-83e9-a0e217d35cdc', 'example company', 'example website', 'example location', 'example status', '{example skill 1, example skill 2, example skill 3}','example bio', 'http://github/david', '{"facebook": "http://facebook/example", "twitter": "http://twitter/example"}');

INSERT INTO profiles (user_id, profile_company, profile_website, profile_location, profile_status, profile_skills, profile_bio, profile_githubusername, profile_social) VALUES ('3d17a5a4-dcc3-48d0-a116-d35b28b1ca7d', 'example company2', 'example website2', 'example location2', 'example status2', '{example skill 1, example skill 2, example skill 3}','example bio2', 'http://github/david', '{"facebook": "http://facebook/example", "twitter": "http://twitter/example"}');

INSERT INTO experiences (user_id, experience_title, experience_company, experience_location, experience_from, experence_to, experience_current, experience_description) VALUES ('528257d7-917f-43f1-83e9-a0e217d35cdc', 'example title', 'example company', 'example location', 'example from', 'example to', TRUE, 'blah blah blah blah blah blah blah blah blah blah blah blah');

INSERT INTO experiences (user_id, experience_title, experience_company, experience_location, experience_from, experence_to, experience_current, experience_description) VALUES ('528257d7-917f-43f1-83e9-a0e217d35cdc', 'example2 title', 'example2 company', 'example2 location', 'example2 from', 'example2 to', FALSE, 'blah blah blah blah blah blah blah blah blah blah blah blah');

INSERT INTO experiences (user_id, experience_title, experience_company, experience_location, experience_from, experence_to, experience_current, experience_description) VALUES ('3d17a5a4-dcc3-48d0-a116-d35b28b1ca7d', 'example title3', 'example compan3', 'example location3', 'example from3', 'example to', TRUE, 'blah blah blah blah blah blah blah blah blah blah blah blah');


/* TESTING QUERIES */

SELECT user_id, user_name, user_avatar FROM users INNER JOIN profiles USING(user_id) WHERE user_id = '528257d7-917f-43f1-83e9-a0e217d35cdc';

SELECT  u.user_id, u.user_name, u.user_avatar,
        p.profile_company, p.profile_website, p.profile_location, p.profile_status, p.profile_skills, p.profile_bio, p.profile_githubusername, p.profile_social,
        to_json(array_agg(e.*)) AS experiences
FROM    users u
INNER JOIN profiles p ON p.user_id = u.user_id
INNER JOIN experiences e ON e.user_id = p.user_id GROUP BY u.user_id, p.profile_company, p.profile_website, p.profile_location, p.profile_status, p.profile_skills, p.profile_bio, p.profile_githubusername, p.profile_social;

SELECT user_id, user_name, user_avatar, profile_company, profile_website, profile_location, profile_status, profile_skills, profile_bio, profile_githubusername, profile_social FROM users INNER JOIN profiles USING(user_id) WHERE user_id::text = '528257d7-917f-43f1-83e9-a0e217d35cdc';
