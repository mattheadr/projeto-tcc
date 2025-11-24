-- Create ratings table for doctor and patient reviews
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL,
  rated_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Users can view ratings for their appointments
CREATE POLICY "Users can view ratings for their appointments"
ON public.ratings
FOR SELECT
USING (
  auth.uid() = rater_id OR 
  auth.uid() = rated_id
);

-- Users can create ratings for completed appointments
CREATE POLICY "Users can create ratings for completed appointments"
ON public.ratings
FOR INSERT
WITH CHECK (
  auth.uid() = rater_id AND
  EXISTS (
    SELECT 1 FROM public.appointments
    WHERE id = appointment_id
    AND status = 'completed'
    AND (patient_id = auth.uid() OR doctor_id = auth.uid())
  )
);

-- Add index for better performance
CREATE INDEX idx_ratings_appointment ON public.ratings(appointment_id);
CREATE INDEX idx_ratings_rated_id ON public.ratings(rated_id);