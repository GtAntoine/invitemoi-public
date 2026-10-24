-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  rating DECIMAL(3,2) DEFAULT 5.0,
  bio TEXT,
  location TEXT NOT NULL,
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  birth_date DATE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create social_links table
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, platform)
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'open',
  event_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK (status IN ('open', 'matched', 'completed')),
  CHECK (event_type IN ('seeking-host', 'offering-host')),
  CHECK (category IN ('restaurant', 'theater', 'museum', 'cinema', 'other'))
);

-- Create applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK (status IN ('pending', 'accepted', 'rejected')),
  UNIQUE(event_id, user_id)
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own record" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Social links policies
CREATE POLICY "Public social links are viewable by everyone" ON social_links
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own social links" ON social_links
  FOR ALL USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid() = created_by);

-- Applications policies
CREATE POLICY "Applications are viewable by event creator and applicant" ON applications
  FOR SELECT USING (
    auth.uid() IN (
      SELECT created_by FROM events WHERE id = event_id
      UNION
      SELECT user_id FROM applications WHERE id = applications.id
    )
  );

CREATE POLICY "Users can create applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own applications" ON applications
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT created_by FROM events WHERE id = event_id
      UNION
      SELECT user_id FROM applications WHERE id = applications.id
    )
  );

CREATE POLICY "Users can delete their own applications" ON applications
  FOR DELETE USING (auth.uid() = user_id);