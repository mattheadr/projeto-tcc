import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotifyRequest {
  appointmentId: string;
  action: 'high_risk' | 'cancelled';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { appointmentId, action }: NotifyRequest = await req.json();

    // Get the appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(*),
        doctor:profiles!appointments_doctor_id_fkey(*)
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      throw new Error('Appointment not found');
    }

    const appointmentTime = appointment.appointment_time;
    const appointmentDate = appointment.appointment_date;
    const doctorId = appointment.doctor_id;

    // Find adjacent appointments on the same day and doctor
    const { data: adjacentAppointments, error: adjacentError } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(*)
      `)
      .eq('doctor_id', doctorId)
      .eq('appointment_date', appointmentDate)
      .neq('id', appointmentId)
      .eq('status', 'scheduled')
      .order('appointment_time');

    if (adjacentError || !adjacentAppointments || adjacentAppointments.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No adjacent appointments found', notified: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter appointments within 2 hours
    const targetTime = new Date(`2000-01-01T${appointmentTime}`);
    const twoHoursMs = 2 * 60 * 60 * 1000;

    const nearbyAppointments = adjacentAppointments.filter(apt => {
      const aptTime = new Date(`2000-01-01T${apt.appointment_time}`);
      const timeDiff = Math.abs(aptTime.getTime() - targetTime.getTime());
      return timeDiff <= twoHoursMs;
    });

    const notificationPromises = nearbyAppointments.map(async (apt) => {
      const patient = apt.patient;
      let message = '';

      if (action === 'high_risk') {
        // Notify that someone might not show up, ask if they can arrive earlier
        message = `Olá ${patient.full_name}! Temos uma consulta marcada para ${appointmentTime} que pode ter um atraso. Você poderia chegar 15 minutos mais cedo (${getEarlierTime(appointmentTime, 15)})? Isso nos ajudaria a otimizar o atendimento. Responda SIM ou NÃO.`;
      } else if (action === 'cancelled') {
        // Offer the cancelled slot
        message = `Olá ${patient.full_name}! Uma consulta foi desmarcada para o horário ${appointmentTime}. Você gostaria de remarcar sua consulta (atualmente ${apt.appointment_time}) para este horário mais cedo? Responda SIM ou NÃO.`;
      }

      // Send WhatsApp message
      const whatsappResponse = await fetch(
        `${supabaseUrl}/functions/v1/send-whatsapp-message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            to: patient.phone || '+5511999999999', // Use actual phone number
            message
          })
        }
      );

      if (!whatsappResponse.ok) {
        console.error(`Failed to send WhatsApp to patient ${patient.id}`);
        return null;
      }

      return apt.id;
    });

    const results = await Promise.all(notificationPromises);
    const successCount = results.filter(r => r !== null).length;

    return new Response(
      JSON.stringify({ 
        message: `Notified ${successCount} adjacent patients`,
        notified: successCount,
        appointmentIds: results.filter(r => r !== null)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in notify-adjacent-patients:', error);
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

function getEarlierTime(timeString: string, minutes: number): string {
  const [hours, mins] = timeString.split(':').map(Number);
  const date = new Date(2000, 0, 1, hours, mins);
  date.setMinutes(date.getMinutes() - minutes);
  return date.toTimeString().slice(0, 5);
}