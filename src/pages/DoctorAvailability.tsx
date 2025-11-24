import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Availability = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

const DoctorAvailability = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAvailability, setNewAvailability] = useState({
    day_of_week: "",
    start_time: "",
    end_time: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchAvailabilities();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth/doctor");
    }
  };

  const fetchAvailabilities = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("doctor_availability")
        .select("*")
        .eq("doctor_id", session.user.id)
        .order("day_of_week")
        .order("start_time");

      if (error) throw error;
      setAvailabilities(data || []);
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

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");

      const { error } = await supabase.from("doctor_availability").insert({
        doctor_id: session.user.id,
        day_of_week: parseInt(newAvailability.day_of_week),
        start_time: newAvailability.start_time,
        end_time: newAvailability.end_time,
      });

      if (error) throw error;

      toast({
        title: "Horário adicionado!",
        description: "Sua disponibilidade foi atualizada",
      });

      setNewAvailability({ day_of_week: "", start_time: "", end_time: "" });
      fetchAvailabilities();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAvailability = async (id: string) => {
    try {
      const { error } = await supabase
        .from("doctor_availability")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Horário removido",
        description: "Sua disponibilidade foi atualizada",
      });

      fetchAvailabilities();
    } catch (error: any) {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getDayLabel = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)?.label || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/doctor/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Disponibilidade</h1>
          <p className="text-muted-foreground">
            Configure os dias e horários em que você atende
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Horário</CardTitle>
              <CardDescription>
                Defina um novo período de disponibilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAvailability} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day">Dia da Semana</Label>
                    <Select
                      value={newAvailability.day_of_week}
                      onValueChange={(value) =>
                        setNewAvailability({ ...newAvailability, day_of_week: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start">Horário Início</Label>
                    <Input
                      id="start"
                      type="time"
                      value={newAvailability.start_time}
                      onChange={(e) =>
                        setNewAvailability({ ...newAvailability, start_time: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end">Horário Fim</Label>
                    <Input
                      id="end"
                      type="time"
                      value={newAvailability.end_time}
                      onChange={(e) =>
                        setNewAvailability({ ...newAvailability, end_time: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={saving} className="w-full md:w-auto">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Horário
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horários Cadastrados</CardTitle>
              <CardDescription>
                Seus períodos de disponibilidade atuais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : availabilities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum horário cadastrado ainda
                </div>
              ) : (
                <div className="space-y-3">
                  {availabilities.map((availability) => (
                    <div
                      key={availability.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{getDayLabel(availability.day_of_week)}</p>
                        <p className="text-sm text-muted-foreground">
                          {availability.start_time.substring(0, 5)} -{" "}
                          {availability.end_time.substring(0, 5)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAvailability(availability.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DoctorAvailability;
