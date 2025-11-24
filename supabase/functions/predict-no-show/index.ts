import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PredictRequest {
  appointmentId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { appointmentId }: PredictRequest = await req.json();

    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(*)
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      throw new Error('Appointment not found');
    }

    const patient = appointment.patient;

    // Calculate features for prediction
    const noShowRate = patient.total_appointments > 0 
      ? patient.no_show_count / patient.total_appointments 
      : 0;

    const bookingLeadTime = appointment.booking_lead_time_days || 0;
    const reminderCount = appointment.reminder_count || 0;
    
    // Simple rule-based prediction (can be enhanced with actual ML model)
    let noShowProbability = 0;
    
    // Factor 1: Historical no-show rate (40% weight)
    noShowProbability += noShowRate * 0.4;
    
    // Factor 2: Booking lead time (20% weight)
    // Short lead time (<2 days) or very long lead time (>14 days) increases risk
    if (bookingLeadTime < 2 || bookingLeadTime > 14) {
      noShowProbability += 0.2;
    }
    
    // Factor 3: Reminder response (20% weight)
    if (reminderCount > 0 && !appointment.reminder_responded) {
      noShowProbability += 0.2;
    }
    
    // Factor 4: Time of day (10% weight)
    // Early morning or late evening appointments have higher no-show rates
    const appointmentHour = parseInt(appointment.appointment_time.split(':')[0]);
    if (appointmentHour < 8 || appointmentHour > 18) {
      noShowProbability += 0.1;
    }
    
    // Factor 5: Frequent no-show flag (10% weight)
    if (patient.is_frequent_no_show) {
      noShowProbability += 0.1;
    }

    // Cap probability at 1.0
    noShowProbability = Math.min(noShowProbability, 1.0);

    let riskLevel: 'low' | 'medium' | 'high';
    let recommendedReminderCount = 1;

    if (noShowProbability < 0.3) {
      riskLevel = 'low';
      recommendedReminderCount = 1;
    } else if (noShowProbability < 0.6) {
      riskLevel = 'medium';
      recommendedReminderCount = 2;
    } else {
      riskLevel = 'high';
      recommendedReminderCount = 3;
    }

    return new Response(
      JSON.stringify({
        appointmentId,
        patientId: patient.id,
        patientName: patient.full_name,
        noShowProbability: Math.round(noShowProbability * 100),
        riskLevel,
        recommendedReminderCount,
        isFrequentNoShow: patient.is_frequent_no_show,
        features: {
          historicalNoShowRate: Math.round(noShowRate * 100),
          totalAppointments: patient.total_appointments,
          noShowCount: patient.no_show_count,
          bookingLeadTime,
          reminderCount,
          reminderResponded: appointment.reminder_responded
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in predict-no-show:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});