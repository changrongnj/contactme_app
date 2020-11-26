CREATE DATABASE contact_me;
USE contact_me;

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    affiliation VARCHAR(255),
    purpose VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

describe users;

INSERT INTO users (email, affiliation, purpose) VALUES
('katie34@yahoo.com', "northeastern univ", "personal connect"), 
('caroline111@gmail.com', "lc", "recruiter connection");


-- Queries from 500 users
SELECT DATE_FORMAT(MIN(created_at), "%M %D %Y") 
    AS earliest_date 
FROM users;

SELECT * 
FROM users 
WHERE created_at = (SELECT MIN(created_at) 
                    FROM users);

SELECT MONTHNAME(created_at) AS month, 
       COUNT(email) AS count 
FROM users 
GROUP BY month
ORDER BY count DESC;

SELECT COUNT(*) AS yahoo_users 
FROM users 
WHERE email LIKE "%@yahoo%";

SELECT CASE
        WHEN email LIKE "%@gmail%" THEN "gmail"
        WHEN email LIKE "%@yahoo%" THEN "yahoo"
        WHEN email LIKE "%@hotmail%" THEN "hotmail"
        ELSE "other"
    END AS provider,
    COUNT(*) AS total_users
FROM users
GROUP BY provider
ORDER BY total_users DESC;