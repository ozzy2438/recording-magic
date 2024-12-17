-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table to store user information
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recordings table to store recording metadata
CREATE TABLE recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- Duration in seconds
    file_path TEXT NOT NULL,   -- Path to the recording file in storage
    file_size BIGINT NOT NULL, -- Size in bytes
    mime_type VARCHAR(100) NOT NULL,
    recording_type VARCHAR(50) NOT NULL, -- 'screen_only', 'camera_screen', etc.
    layout VARCHAR(50),                  -- 'camera_right', 'camera_left', etc.
    has_audio BOOLEAN DEFAULT false,
    has_camera BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

-- Shares table to track recording shares
CREATE TABLE shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recording_id UUID REFERENCES recordings(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES users(id) ON DELETE CASCADE,
    shared_with VARCHAR(255), -- Email or social media handle
    platform VARCHAR(50) NOT NULL, -- 'email', 'twitter', etc.
    status VARCHAR(50) NOT NULL,   -- 'pending', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE -- Optional expiration time
);

-- Tags table for categorizing recordings
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recording tags junction table
CREATE TABLE recording_tags (
    recording_id UUID REFERENCES recordings(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (recording_id, tag_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_recordings_user_id ON recordings(user_id);
CREATE INDEX idx_recordings_created_at ON recordings(created_at);
CREATE INDEX idx_shares_recording_id ON shares(recording_id);
CREATE INDEX idx_shares_shared_by ON shares(shared_by);
CREATE INDEX idx_recording_tags_tag_id ON recording_tags(tag_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recordings_updated_at
    BEFORE UPDATE ON recordings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO users (email, username) 
VALUES ('osmanorka@gmail.com', 'ozmin2410');

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recording_tags ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Recordings policies
CREATE POLICY "Users can CRUD their own recordings"
    ON recordings FOR ALL
    USING (auth.uid() = user_id);

-- Shares policies
CREATE POLICY "Users can manage their own shares"
    ON shares FOR ALL
    USING (auth.uid() = shared_by);

CREATE POLICY "Users can view shares shared with them"
    ON shares FOR SELECT
    USING (shared_with = auth.email());

-- Tags policies
CREATE POLICY "Anyone can view tags"
    ON tags FOR SELECT
    TO authenticated
    USING (true);

-- Recording tags policies
CREATE POLICY "Users can manage tags for their recordings"
    ON recording_tags FOR ALL
    USING (EXISTS (
        SELECT 1 FROM recordings
        WHERE recordings.id = recording_tags.recording_id
        AND recordings.user_id = auth.uid()
    ));