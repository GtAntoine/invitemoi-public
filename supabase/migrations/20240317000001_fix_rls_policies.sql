-- Drop existing policies
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can update their own record" ON users;
DROP POLICY IF EXISTS "Public social links are viewable by everyone" ON social_links;
DROP POLICY IF EXISTS "Users can manage their own social links" ON social_links;
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "Users can create events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Applications are viewable by event creator and applicant" ON applications;
DROP POLICY IF EXISTS "Users can create applications" ON applications;
DROP POLICY IF EXISTS "Users can manage their own applications" ON applications;
DROP POLICY IF EXISTS "Users can delete their own applications" ON applications;

-- Users policies
CREATE POLICY "Enable read access for all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update access for users based on id" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Social links policies
CREATE POLICY "Enable read access for public links and owners" ON social_links
  FOR SELECT USING (is_public OR auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users" ON social_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for owners" ON social_links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for owners" ON social_links
  FOR DELETE USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Enable read access for all users" ON events
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable update access for event creators" ON events
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Enable delete access for event creators" ON events
  FOR DELETE USING (auth.uid() = created_by);

-- Applications policies
CREATE POLICY "Enable read access for event creators and applicants" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND created_by = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Enable insert access for authenticated users" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for event creators and applicants" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM events WHERE id = event_id AND created_by = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Enable delete access for applicants" ON applications
  FOR DELETE USING (auth.uid() = user_id);