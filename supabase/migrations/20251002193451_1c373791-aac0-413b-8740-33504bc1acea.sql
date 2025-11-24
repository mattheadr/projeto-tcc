-- Create profiles table for both patients and doctors
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Doctor-specific fields
  crm TEXT UNIQUE,
  specialty TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8)
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_type TEXT NOT NULL CHECK (appointment_type IN ('presencial', 'online')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments"
  ON public.appointments FOR SELECT
  USING (
    auth.uid() = patient_id OR 
    auth.uid() = doctor_id
  );

CREATE POLICY "Patients can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own appointments"
  ON public.appointments FOR UPDATE
  USING (
    auth.uid() = patient_id OR 
    auth.uid() = doctor_id
  );

CREATE POLICY "Users can delete their own appointments"
  ON public.appointments FOR DELETE
  USING (auth.uid() = patient_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'role', 'patient')
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for faster queries
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_profiles_role ON public.profiles(role);