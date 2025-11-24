import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

type TimeSlot = {
  time: string;
  available: boolean;
};

type DoctorAvailability = {
  day_of_week: number;
  start_time: string;
  end_time: string;
};

interface AppointmentSchedulerProps {
  doctorId: string;
  onSelectDateTime: (date: string, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export const AppointmentScheduler = ({
  doctorId,
  onSelectDateTime,
  selectedDate,
  selectedTime,
}: AppointmentSchedulerProps) => {
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);

  useEffect(() => {
    if (doctorId) {
      fetchDoctorAvailability();
    }
  }, [doctorId]);

  useEffect(() => {
    if (date && doctorId) {
      generateTimeSlots();
    }
  }, [date, doctorId, availability]);

  const fetchDoctorAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from("doctor_availability")
        .select("day_of_week, start_time, end_time")
        .eq("doctor_id", doctorId);

      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const generateTimeSlots = async () => {
    if (!date) return;
    
    setLoading(true);
    const dayOfWeek = date.getDay();
    
    // Find availability for this day
    const dayAvailability = availability.filter(a => a.day_of_week === dayOfWeek);
    
    if (dayAvailability.length === 0) {
      setTimeSlots([]);
      setLoading(false);
      return;
    }

    // Fetch existing appointments for this date
    const { data: bookedAppointments } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("doctor_id", doctorId)
      .eq("appointment_date", format(date, "yyyy-MM-dd"));

    const bookedTimes = new Set(
      bookedAppointments?.map(a => a.appointment_time) || []
    );

    // Generate slots for each availability period
    const slots: TimeSlot[] = [];
    dayAvailability.forEach(avail => {
      const [startHour, startMinute] = avail.start_time.split(":").map(Number);
      const [endHour, endMinute] = avail.end_time.split(":").map(Number);
      
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (
        currentHour < endHour ||
        (currentHour === endHour && currentMinute < endMinute)
      ) {
        const timeString = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}:00`;
        slots.push({
          time: timeString,
          available: !bookedTimes.has(timeString),
        });
        
        // Increment by 30 minutes
        currentMinute += 30;
        if (currentMinute >= 60) {
          currentHour += 1;
          currentMinute = 0;
        }
      }
    });

    setTimeSlots(slots);
    setLoading(false);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleTimeSelect = (time: string) => {
    if (date) {
      onSelectDateTime(format(date, "yyyy-MM-dd"), time);
    }
  };

  const isDateAvailable = (checkDate: Date) => {
    const dayOfWeek = checkDate.getDay();
    return availability.some(a => a.day_of_week === dayOfWeek);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Selecione a Data</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={(date) => 
            date < new Date(new Date().setHours(0, 0, 0, 0)) || 
            !isDateAvailable(date)
          }
          className="rounded-md border"
        />
      </div>

      {date && (
        <div className="space-y-2">
          <Label>Horários Disponíveis</Label>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : timeSlots.length === 0 ? (
            <Card className="p-4 text-center text-muted-foreground">
              Médico não disponível nesta data
            </Card>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    "p-3 rounded-md border text-sm font-medium transition-colors",
                    slot.available
                      ? selectedTime === slot.time
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-accent hover:text-accent-foreground"
                      : "bg-destructive/20 text-destructive border-destructive cursor-not-allowed opacity-60",
                  )}
                >
                  {slot.time.substring(0, 5)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
