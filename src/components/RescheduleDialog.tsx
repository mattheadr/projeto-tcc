import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AppointmentScheduler } from "./AppointmentScheduler";

type RescheduleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  doctorId: string;
  currentDate: string;
  currentTime: string;
  onSuccess: () => void;
};

export function RescheduleDialog({
  open,
  onOpenChange,
  appointmentId,
  doctorId,
  currentDate,
  currentTime,
  onSuccess,
}: RescheduleDialogProps) {
  const [newDate, setNewDate] = useState(currentDate);
  const [newTime, setNewTime] = useState(currentTime);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!newDate || !newTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione uma nova data e horário",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          appointment_date: newDate,
          appointment_time: newTime,
        })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: "Consulta reagendada!",
        description: "Sua consulta foi reagendada com sucesso",
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao reagendar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Reagendar Consulta</DialogTitle>
          <DialogDescription>
            Escolha uma nova data e horário para sua consulta
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <AppointmentScheduler
            doctorId={doctorId}
            onSelectDateTime={(date, time) => {
              setNewDate(date);
              setNewTime(time);
            }}
            selectedTime={newTime}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !newDate || !newTime}>
            {loading ? "Reagendando..." : "Confirmar Reagendamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
