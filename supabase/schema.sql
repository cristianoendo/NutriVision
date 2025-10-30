-- VidaLeve Database Schema for Supabase
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

--------------------------------------------------------------------------------
-- PROFILES TABLE
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT,
    age INTEGER NOT NULL CHECK (age >= 10 AND age <= 120),
    weight NUMERIC(5,2) NOT NULL CHECK (weight > 0),
    height NUMERIC(5,2) NOT NULL CHECK (height > 0),
    waist NUMERIC(5,2) NOT NULL CHECK (waist > 0),
    hip NUMERIC(5,2) NOT NULL CHECK (hip > 0),
    gender TEXT NOT NULL CHECK (gender IN ('female', 'male', 'other')),
    activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very-active')),
    reproductive_phase TEXT CHECK (reproductive_phase IN ('regular-cycle', 'irregular-cycle', 'perimenopause', 'menopause', 'postmenopause', 'pregnant', 'breastfeeding', 'not-applicable')),
    goal TEXT NOT NULL CHECK (goal IN ('weight-loss', 'maintenance', 'muscle-gain', 'hormonal-balance')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
    ON public.profiles FOR DELETE
    USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- MEALS TABLE
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('breakfast', 'morning-snack', 'lunch', 'afternoon-snack', 'dinner', 'evening-snack')),
    foods JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_calories NUMERIC(7,2) NOT NULL DEFAULT 0,
    total_protein NUMERIC(6,2) NOT NULL DEFAULT 0,
    total_carbs NUMERIC(6,2) NOT NULL DEFAULT 0,
    total_fats NUMERIC(6,2) NOT NULL DEFAULT 0,
    total_fiber NUMERIC(6,2) NOT NULL DEFAULT 0,
    avg_glycemic_index NUMERIC(4,2),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    photo TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_meals_user_id ON public.meals(user_id);
CREATE INDEX idx_meals_timestamp ON public.meals(timestamp DESC);
CREATE INDEX idx_meals_user_timestamp ON public.meals(user_id, timestamp DESC);

-- Enable RLS
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meals
CREATE POLICY "Users can view their own meals"
    ON public.meals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals"
    ON public.meals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
    ON public.meals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
    ON public.meals FOR DELETE
    USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- BODY METRICS TABLE (for tracking weight/measurements over time)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.body_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    weight NUMERIC(5,2) NOT NULL,
    waist NUMERIC(5,2),
    hip NUMERIC(5,2),
    bmi NUMERIC(4,2) NOT NULL,
    bmi_category TEXT NOT NULL,
    body_fat_percentage NUMERIC(4,2) NOT NULL,
    wh_ratio NUMERIC(4,3) NOT NULL,
    body_type TEXT NOT NULL CHECK (body_type IN ('apple', 'pear', 'mixed')),
    bmr NUMERIC(6,2) NOT NULL,
    tdee NUMERIC(6,2) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_body_metrics_user_id ON public.body_metrics(user_id);
CREATE INDEX idx_body_metrics_recorded_at ON public.body_metrics(recorded_at DESC);
CREATE INDEX idx_body_metrics_user_recorded ON public.body_metrics(user_id, recorded_at DESC);

-- Enable RLS
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own body metrics"
    ON public.body_metrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own body metrics"
    ON public.body_metrics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own body metrics"
    ON public.body_metrics FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own body metrics"
    ON public.body_metrics FOR DELETE
    USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- DAILY WATER TRACKING TABLE
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_water (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    amount_ml INTEGER NOT NULL DEFAULT 0,
    goal_ml INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX idx_daily_water_user_id ON public.daily_water(user_id);
CREATE INDEX idx_daily_water_date ON public.daily_water(date DESC);
CREATE INDEX idx_daily_water_user_date ON public.daily_water(user_id, date DESC);

-- Enable RLS
ALTER TABLE public.daily_water ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own water tracking"
    ON public.daily_water FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water tracking"
    ON public.daily_water FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water tracking"
    ON public.daily_water FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water tracking"
    ON public.daily_water FOR DELETE
    USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- RECIPES FAVORITES TABLE
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recipes_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recipe_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, recipe_id)
);

-- Indexes
CREATE INDEX idx_recipes_favorites_user_id ON public.recipes_favorites(user_id);
CREATE INDEX idx_recipes_favorites_recipe_id ON public.recipes_favorites(recipe_id);

-- Enable RLS
ALTER TABLE public.recipes_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own favorite recipes"
    ON public.recipes_favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite recipes"
    ON public.recipes_favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite recipes"
    ON public.recipes_favorites FOR DELETE
    USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- FUNCTIONS & TRIGGERS
--------------------------------------------------------------------------------

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for daily_water
CREATE TRIGGER update_daily_water_updated_at
    BEFORE UPDATE ON public.daily_water
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

--------------------------------------------------------------------------------
-- VIEWS (for easier querying)
--------------------------------------------------------------------------------

-- View for daily summary (calories, macros, water)
CREATE OR REPLACE VIEW public.daily_summary AS
SELECT
    m.user_id,
    DATE(m.timestamp) as date,
    COUNT(m.id) as meal_count,
    SUM(m.total_calories) as total_calories,
    SUM(m.total_protein) as total_protein,
    SUM(m.total_carbs) as total_carbs,
    SUM(m.total_fats) as total_fats,
    SUM(m.total_fiber) as total_fiber,
    AVG(m.avg_glycemic_index) as avg_glycemic_index,
    COALESCE(w.amount_ml, 0) as water_intake_ml,
    COALESCE(w.goal_ml, 0) as water_goal_ml
FROM public.meals m
LEFT JOIN public.daily_water w ON m.user_id = w.user_id AND DATE(m.timestamp) = w.date
GROUP BY m.user_id, DATE(m.timestamp), w.amount_ml, w.goal_ml;

--------------------------------------------------------------------------------
-- INITIAL DATA & CLEANUP
--------------------------------------------------------------------------------

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant access to views
GRANT SELECT ON public.daily_summary TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ VidaLeve database schema created successfully!';
    RAISE NOTICE '📝 Next steps:';
    RAISE NOTICE '   1. Configure your authentication providers in Supabase Auth settings';
    RAISE NOTICE '   2. Update your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY';
    RAISE NOTICE '   3. Test the connection in your app';
END $$;
