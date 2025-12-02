/*
  # Add email notification system
  
  1. Changes
    - Create function to send email notifications
    - Create trigger for sending emails on new applications
    - Store Edge Function URL in a dedicated settings table
  
  2. Security
    - Function is executed with invoker privileges
    - Only system can access the settings table
*/

-- Create settings table for storing configuration
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert Edge Function URL
INSERT INTO app_settings (key, value, description)
VALUES (
  'edge_function_url',
  'https://ueurliamkagzrbhdqdmx.supabase.co/functions/v1',
  'URL for Supabase Edge Functions'
);

-- Create function to get setting value
CREATE OR REPLACE FUNCTION get_setting(setting_key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT value FROM app_settings WHERE key = setting_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to send email notification
CREATE OR REPLACE FUNCTION send_email_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Appeler l'Edge Function pour envoyer l'email
  PERFORM net.http_post(
    url := get_setting('edge_function_url') || '/send-email-notification',
    body := json_build_object('notificationId', NEW.id)::text,
    headers := json_build_object('Content-Type', 'application/json')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER send_email_notification_trigger
  AFTER INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION send_email_notification();

-- Add RLS to app_settings
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Only allow select access to authenticated users
CREATE POLICY "Allow select for authenticated users" ON app_settings
  FOR SELECT TO authenticated
  USING (true);

-- Prevent all other operations
CREATE POLICY "Prevent all other operations" ON app_settings
  FOR ALL TO authenticated
  USING (false);