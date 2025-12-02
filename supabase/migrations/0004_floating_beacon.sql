-- Drop existing trigger and function
DROP TRIGGER IF EXISTS notify_event_owner_trigger ON applications;
DROP FUNCTION IF EXISTS notify_event_owner;

-- Create notification function
CREATE OR REPLACE FUNCTION notify_event_owner()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification into notifications table
  INSERT INTO notifications (
    user_id,
    event_id,
    type,
    message,
    read
  ) VALUES (
    (SELECT created_by FROM events WHERE id = NEW.event_id),
    NEW.event_id,
    'new_application',
    NEW.message,
    false
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER notify_event_owner_trigger
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_event_owner();

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);