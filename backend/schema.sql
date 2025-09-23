CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    hashed_password TEXT,
    profile_json JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE budgets (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    income DECIMAL(12,2),
    expenses_json JSONB,
    currency VARCHAR(3) DEFAULT 'ZAR',
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE goals (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    goal_type VARCHAR(50),
    target_amount DECIMAL(12,2),
    current_amount DECIMAL(12,2) DEFAULT 0,
    target_date DATE,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE lessons (
    id UUID PRIMARY KEY,
    title VARCHAR(200),
    topic VARCHAR(100),
    difficulty VARCHAR(20),
    content_json JSONB,
    estimated_duration INTEGER, -- minutes
    language VARCHAR(10) DEFAULT 'en'
);

CREATE TABLE challenges (
    id UUID PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    points INTEGER,
    category VARCHAR(50),
    difficulty VARCHAR(20)
);

CREATE TABLE user_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    challenge_id UUID REFERENCES challenges(id),
    lesson_id UUID REFERENCES lessons(id),
    status VARCHAR(20),
    points_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMP
);
