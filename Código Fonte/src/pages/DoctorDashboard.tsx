import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, LogOut, Video, MapPin, Settings, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PatientRiskIndicator } from "@/components/PatientRiskIndicator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PatientMLInsights } from "@/components/PatientMLInsights";

type Appointment = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  actual_status?: string;
  booking_lead_time_days?: number;
  reminder_count?: number;
  reminder_responded?: boolean;
  patient: {
    id: string;
    full_name: string;
    phone: string;
    no_show_count: number;
    total_appointments: number;
    is_frequent_no_show: boolean;
  };
};

type MLPrediction = {
  appointmentId: string;
  patientId: string;
  patientName: string;
  noShowProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendedReminderCount: number;
  isFrequentNoShow: boolean;
  features: {
    historicalNoShowRate: number;
    totalAppointments: number;
    noShowCount: number;
    bookingLeadTime: number;
    reminderCount: number;
    reminderResponded: boolean;
  };
};

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [predictions, setPredictions] = useState<{[key: string]: MLPrediction}>({});
  const [loading, setLoading] = useState(true);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<MLPrediction | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      fetchPredictions();
    }
  }, [appointments]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth/doctor");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "doctor") {
      navigate("/");
      return;
    }

    setDoctorName(profile.full_name);
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
          actual_status,
          booking_lead_time_days,
          reminder_count,
          reminder_responded,
          profiles!appointments_patient_id_fkey (
            id,
            full_name,
            phone,
            no_show_count,
            total_appointments,
            is_frequent_no_show
          )
        `)
        .eq("doctor_id", session.user.id)
        .eq("status", "scheduled")
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      
      // Map the data to match our Appointment type
      const mappedData = (data || []).map((apt: any) => ({
        ...apt,
        patient: apt.profiles || {
          id: '',
          full_name: 'Paciente não encontrado',
          phone: '',
          no_show_count: 0,
          total_appointments: 0,
          is_frequent_no_show: false
        }
      }));
      
      setAppointments(mappedData);
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

  const fetchPredictions = async () => {
    setLoadingPredictions(true);
    try {
      const predictionsMap: {[key: string]: MLPrediction} = {};
      
      for (const appointment of appointments) {
        const { data, error } = await supabase.functions.invoke('predict-no-show', {
          body: { appointmentId: appointment.id }
        });

        if (error) {
          console.error(`Error predicting for appointment ${appointment.id}:`, error);
          continue;
        }

        if (data) {
          predictionsMap[appointment.id] = data;
          
          // Se é alto risco, notificar pacientes adjacentes
          if (data.riskLevel === 'high') {
            await supabase.functions.invoke('notify-adjacent-patients', {
              body: { 
                appointmentId: appointment.id,
                action: 'high_risk'
              }
            });
          }
        }
      }

      setPredictions(predictionsMap);
    } catch (error: any) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoadingPredictions(false);
    }
  };

  const handleMarkAsNoShow = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ actual_status: 'no_show' } as any)
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Consulta marcada como falta",
      });

      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMarkAsCompleted = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ actual_status: 'completed' } as any)
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Consulta marcada como concluída",
      });

      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
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
              Dr(a). {doctorName}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-2">Agenda Médica</h2>
            <p className="text-muted-foreground">
              Suas consultas agendadas
            </p>
          </div>
          <Button onClick={() => navigate("/doctor/availability")}>
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar Horários
          </Button>
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
              <p className="text-muted-foreground">
                Aguarde pacientes agendarem consultas com você
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appointment) => {
              const prediction = predictions[appointment.id];
              const patient = appointment.patient;
              
              return (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">
                            {patient.full_name}
                          </CardTitle>
                          {prediction && (
                            <PatientRiskIndicator 
                              riskLevel={prediction.riskLevel}
                              noShowProbability={prediction.noShowProbability}
                              isFrequentNoShow={prediction.isFrequentNoShow}
                            />
                          )}
                          {loadingPredictions && !prediction && (
                            <Badge variant="outline" className="animate-pulse">
                              <Activity className="h-3 w-3 mr-1" />
                              Analisando...
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {patient.phone || "Telefone não informado"}
                        </CardDescription>
                      </div>
                      <Badge variant={appointment.status === "scheduled" ? "default" : "secondary"}>
                        {appointment.status === "scheduled" ? "Agendada" : 
                         appointment.status === "completed" ? "Concluída" : "Cancelada"}
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

                      {prediction && (
                        <div className="flex gap-2 pt-2 border-t">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedPatient(prediction)}
                              >
                                <Activity className="h-4 w-4 mr-2" />
                                Ver Insights IA
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Análise de IA do Paciente</DialogTitle>
                              </DialogHeader>
                              {selectedPatient && (
                                <PatientMLInsights
                                  patientName={prediction.patientName}
                                  noShowCount={prediction.features.noShowCount}
                                  totalAppointments={prediction.features.totalAppointments}
                                  avgBookingLeadTime={prediction.features.bookingLeadTime}
                                  reminderResponseRate={0.75}
                                  noShowProbability={prediction.noShowProbability}
                                  riskLevel={prediction.riskLevel}
                                />
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkAsCompleted(appointment.id)}
                          >
                            Marcar Concluída
                          </Button>

                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleMarkAsNoShow(appointment.id)}
                          >
                            Marcar Falta
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;