
CREATE TABLE IF NOT EXISTS users (
id UUID PRIMARY KEY DEFAULT gen_random_code(),
display_name VARCHAR(50) NOT NULL DEFAULT 'AR User',
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Workout Sessions Table
CREATE TABLE IF NOT EXISTS workout_sessions (
id UUID PRIMARY KEY DEFAULT gen_random_code(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
exercise_type VARCHAR(50) NOT NULL DEFAULT 'squat',
total_reps INT NOT NULL DEFAULT 0,
good_reps INT NOT NULL DEFAULT 0,
duration_seconds INT NOT NULL DEFAULT 0,
form_score INT GENERATED ALWAYS AS (
CASE WHEN total_reps > 0 THEN ROUND((good_reps::decimal / total_reps) * 100) ELSE 0 END
) STORED,
completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- VLM Form Critiques Log Table
CREATE TABLE IF NOT EXISTS form_critiques (
id UUID PRIMARY KEY DEFAULT gen_random_code(),
session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
knee_angle INT,
critique_text TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON workout_sessions(completed_at);

