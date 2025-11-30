-- Fix RLS policy on profiles table to restrict access
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Only allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Allow patients to view only doctor profiles (not other patients)
CREATE POLICY "Patients can view doctor profiles"
ON public.profiles
FOR SELECT
USING (role = 'doctor');

-- Create doctor availability table
CREATE TABLE public.doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(doctor_id, day_of_week, start_time)
);

-- Enable RLS on doctor_availability
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;

-- Doctors can manage their own availability
CREATE POLICY "Doctors can manage their availability"
ON public.doctor_availability
FOR ALL
USING (auth.uid() = doctor_id);

-- Patients can view doctor availability
CREATE POLICY "Patients can view doctor availability"
ON public.doctor_availability
FOR SELECT
USING (true);