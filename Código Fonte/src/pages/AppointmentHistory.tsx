import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, LogOut, Video, MapPin, ArrowLeft, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RatingDialog } from "@/components/RatingDialog";

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

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [ratingDialog, setRatingDialog] = useState<{
    open: boolean;
    appointmentId: string;
    doctorId: string;
    doctorName: string;
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
        .in("status", ["cancelled", "completed"])
        .order("appointment_date", { ascending: false });

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
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/patient/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-3xl font-bold mb-2">Histórico de Consultas</h2>
            <p className="text-muted-foreground">
              Consultas canceladas e concluídas
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando histórico...</p>
          </div>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum histórico disponível
              </h3>
              <p className="text-muted-foreground">
                Você ainda não possui consultas canceladas ou concluídas
              </p>
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
                    <Badge variant={appointment.status === "completed" ? "default" : "secondary"}>
                      {appointment.status === "completed" ? "Concluída" : "Cancelada"}
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
                    
                    {appointment.status === "completed" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRatingDialog({
                            open: true,
                            appointmentId: appointment.id,
                            doctorId: appointment.doctor_id,
                            doctorName: (appointment as any).profiles?.full_name || "",
                          })}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Avaliar
                        </Button>
                      </div>
                    )}
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
    </div>
  );
};

export default AppointmentHistory;
