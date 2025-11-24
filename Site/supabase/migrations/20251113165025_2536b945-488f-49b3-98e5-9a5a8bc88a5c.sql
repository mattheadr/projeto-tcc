-- Add patient behavior tracking columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS no_show_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_appointments integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_channel text DEFAULT 'email';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_frequent_no_show boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Add tracking fields to appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminder_count integer DEFAULT 0;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminder_responded boolean DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS booking_lead_time_days integer;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS time_of_day text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS actual_status text;

-- Create appointment history table for ML training data
CREATE TABLE IF NOT EXISTS appointment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  doctor_id uuid NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  appointment_type text NOT NULL,
  scheduled_at timestamp with time zone DEFAULT now(),
  booking_lead_time_days integer,
  time_of_day text,
  reminder_count integer DEFAULT 0,
  reminder_responded boolean DEFAULT false,
  preferred_channel text,
  patient_age_group text,
  attended boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on appointment_history
ALTER TABLE appointment_history ENABLE ROW LEVEL SECURITY;

-- Doctors can view appointment history
CREATE POLICY "Doctors can view appointment history"
ON appointment_history FOR SELECT
USING (auth.uid() = doctor_id);

-- Create reminders table
CREATE TABLE IF NOT EXISTS appointment_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  sent_at timestamp with time zone DEFAULT now(),
  channel text NOT NULL,
  responded boolean DEFAULT false,
  responded_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on reminders
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;

-- Users can view reminders for their appointments
CREATE POLICY "Users can view their appointment reminders"
ON appointment_reminders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM appointments
    WHERE appointments.id = appointment_reminders.appointment_id
    AND (appointments.patient_id = auth.uid() OR appointments.doctor_id = auth.uid())
  )
);

-- System can insert reminders
CREATE POLICY "System can insert reminders"
ON appointment_reminders FOR INSERT
WITH CHECK (true);

-- Create patient ML features view for doctors
CREATE OR REPLACE VIEW patient_ml_features AS
SELECT 
  p.id as patient_id,
  p.full_name,
  p.no_show_count,
  p.total_appointments,
  p.preferred_channel,
  p.is_frequent_no_show,
  EXTRACT(YEAR FROM AGE(p.date_of_birth)) as age,
  COUNT(DISTINCT ah.id) as historical_appointments,
  SUM(CASE WHEN ah.attended = false THEN 1 ELSE 0 END) as historical_no_shows,
  AVG(ah.booking_lead_time_days) as avg_booking_lead_time,
  AVG(ah.reminder_count) as avg_reminders_sent,
  SUM(CASE WHEN ah.reminder_responded THEN 1 ELSE 0 END)::float / NULLIF(COUNT(ah.id), 0) as reminder_response_rate
FROM profiles p
LEFT JOIN appointment_history ah ON p.id = ah.patient_id
WHERE p.role = 'patient'
GROUP BY p.id, p.full_name, p.no_show_count, p.total_appointments, p.preferred_channel, p.is_frequent_no_show, p.date_of_birth;

-- Function to update patient statistics
CREATE OR REPLACE FUNCTION update_patient_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile statistics when appointment status changes
  IF NEW.actual_status = 'completed' AND (OLD.actual_status IS NULL OR OLD.actual_status != 'completed') THEN
    UPDATE profiles 
    SET total_appointments = total_appointments + 1
    WHERE id = NEW.patient_id;
  ELSIF NEW.actual_status = 'no_show' AND (OLD.actual_status IS NULL OR OLD.actual_status != 'no_show') THEN
    UPDATE profiles 
    SET 
      no_show_count = no_show_count + 1,
      total_appointments = total_appointments + 1,
      is_frequent_no_show = CASE 
        WHEN (no_show_count + 1)::float / NULLIF((total_appointments + 1), 0) > 0.3 THEN true
        ELSE false
      END
    WHERE id = NEW.patient_id;
    
    -- Record in history
    INSERT INTO appointment_history (
      patient_id, doctor_id, appointment_date, appointment_time,
      appointment_type, booking_lead_time_days, time_of_day,
      reminder_count, reminder_responded, preferred_channel,
      attended
    )
    SELECT 
      NEW.patient_id, NEW.doctor_id, NEW.appointment_date, NEW.appointment_time,
      NEW.appointment_type, NEW.booking_lead_time_days, NEW.time_of_day,
      NEW.reminder_count, NEW.reminder_responded, p.preferred_channel,
      false
    FROM profiles p WHERE p.id = NEW.patient_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update patient stats
DROP TRIGGER IF EXISTS update_patient_stats_trigger ON appointments;
CREATE TRIGGER update_patient_stats_trigger
AFTER UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_patient_stats();