CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    image_src VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    confidence DECIMAL NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    data BYTEA NOT NULL,
    expiry TIMESTAMP(6) NOT NULL
);

