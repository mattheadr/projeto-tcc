import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, LogOut, Plus, Video, MapPin, Star, Edit, X, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RatingDialog } from "@/components/RatingDialog";
import { RescheduleDialog } from "@/components/RescheduleDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Appointment = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  doctor_id: string;
  doctor: {
    full_name: string;
    specialty: string;
  };
};

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [ratingDialog, setRatingDialog] = useState<{
    open: boolean;
    appointmentId: string;
    doctorId: string;
    doctorName: string;
  } | null>(null);
  const [rescheduleDialog, setRescheduleDialog] = useState<{
    open: boolean;
    appointmentId: string;
    doctorId: string;
    currentDate: string;
    currentTime: string;
  } | null>(null);
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    appointmentId: string;
  } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchAppointments();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth/patient");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "patient") {
      navigate("/");
      return;
    }

    setUserName(profile.full_name);
  };

  const fetchAppointments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          appointment_time,
          appointment_type,
          status,
          doctor_id,
          profiles!appointments_doctor_id_fkey (
            full_name,
            specialty
          )
        `)
        .eq("patient_id", session.user.id)
        .eq("status", "scheduled")
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      setAppointments(data as any || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: "Consulta cancelada",
        description: "A consulta foi cancelada com sucesso",
      });
      
      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Erro ao cancelar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">NewCheck</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Olá, {userName}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Próximas Consultas</h2>
            <p className="text-muted-foreground">
              Gerencie seus agendamentos médicos
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/patient/history")} variant="outline" size="lg">
              <History className="h-4 w-4 mr-2" />
              Histórico
            </Button>
            <Button onClick={() => navigate("/patient/book")} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Nova Consulta
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando consultas...</p>
          </div>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma consulta agendada
              </h3>
              <p className="text-muted-foreground mb-4">
                Agende sua primeira consulta agora mesmo
              </p>
              <Button onClick={() => navigate("/patient/book")}>
                Agendar Consulta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                  <div>
                      <CardTitle className="text-xl">
                        Dr(a). {(appointment as any).profiles?.full_name}
                      </CardTitle>
                      <CardDescription>
                        {(appointment as any).profiles?.specialty}
                      </CardDescription>
                    </div>
                    <Badge variant="default">
                      Agendada
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(appointment.appointment_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.appointment_type === "online" ? (
                          <Video className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>
                          {appointment.appointment_type === "online" ? "Online" : "Presencial"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">{appointment.appointment_time}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRescheduleDialog({
                          open: true,
                          appointmentId: appointment.id,
                          doctorId: appointment.doctor_id,
                          currentDate: appointment.appointment_date,
                          currentTime: appointment.appointment_time,
                        })}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Reagendar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCancelDialog({
                          open: true,
                          appointmentId: appointment.id,
                        })}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {ratingDialog && (
        <RatingDialog
          open={ratingDialog.open}
          onOpenChange={(open) => !open && setRatingDialog(null)}
          appointmentId={ratingDialog.appointmentId}
          ratedId={ratingDialog.doctorId}
          ratedName={ratingDialog.doctorName}
          ratedRole="doctor"
        />
      )}

      {rescheduleDialog && (
        <RescheduleDialog
          open={rescheduleDialog.open}
          onOpenChange={(open) => !open && setRescheduleDialog(null)}
          appointmentId={rescheduleDialog.appointmentId}
          doctorId={rescheduleDialog.doctorId}
          currentDate={rescheduleDialog.currentDate}
          currentTime={rescheduleDialog.currentTime}
          onSuccess={fetchAppointments}
        />
      )}

      <AlertDialog
        open={cancelDialog?.open || false}
        onOpenChange={(open) => !open && setCancelDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Consulta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (cancelDialog) {
                  handleCancelAppointment(cancelDialog.appointmentId);
                  setCancelDialog(null);
                }
              }}
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PatientDashboard;