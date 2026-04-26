-- NutriLens AI — Database Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Core User Profile
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL DEFAULT 'ผู้ใช้ใหม่',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Main Meal Log
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL,
    meal_name TEXT NOT NULL DEFAULT 'ไม่ระบุ',
    total_calories INTEGER NOT NULL,
    analyzed_at TIMESTAMP DEFAULT NOW()
);

-- Ingredient Breakdown
CREATE TABLE IF NOT EXISTS meal_ingredients (
    id SERIAL PRIMARY KEY,
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    estimated_weight_g INTEGER,
    calories INTEGER,
    protein FLOAT,
    carbs FLOAT,
    fat FLOAT
);

-- Gamification
CREATE TABLE IF NOT EXISTS user_progression (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    last_login_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_analyzed_at ON meals(analyzed_at DESC);
CREATE INDEX IF NOT EXISTS idx_meal_ingredients_meal_id ON meal_ingredients(meal_id);
