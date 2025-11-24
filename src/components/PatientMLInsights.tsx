import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface PatientMLInsightsProps {
  patientName: string;
  noShowCount: number;
  totalAppointments: number;
  avgBookingLeadTime: number;
  reminderResponseRate: number;
  noShowProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export const PatientMLInsights = ({
  patientName,
  noShowCount,
  totalAppointments,
  avgBookingLeadTime,
  reminderResponseRate,
  noShowProbability,
  riskLevel
}: PatientMLInsightsProps) => {
  const noShowRate = totalAppointments > 0 ? (noShowCount / totalAppointments) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Insights do Paciente: {patientName}
        </CardTitle>
        <CardDescription>
          Análise preditiva baseada em aprendizado de máquina
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Nível de Risco de Falta</span>
            <Badge 
              variant={riskLevel === 'high' ? 'destructive' : riskLevel === 'medium' ? 'default' : 'secondary'}
            >
              {riskLevel === 'high' ? 'Alto' : riskLevel === 'medium' ? 'Médio' : 'Baixo'}
            </Badge>
          </div>
          <Progress value={noShowProbability} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Probabilidade de falta: {noShowProbability}%
          </p>
        </div>

        {/* Historical Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Taxa de Faltas</p>
            <div className="flex items-center gap-2">
              {noShowRate > 30 ? (
                <TrendingUp className="h-4 w-4 text-destructive" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
              <p className="text-2xl font-bold">{noShowRate.toFixed(1)}%</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {noShowCount} de {totalAppointments} consultas
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Taxa de Resposta</p>
            <div className="flex items-center gap-2">
              {reminderResponseRate > 0.7 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <p className="text-2xl font-bold">{(reminderResponseRate * 100).toFixed(0)}%</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Respostas aos lembretes
            </p>
          </div>
        </div>

        {/* Booking Pattern */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Tempo Médio de Agendamento</p>
          <p className="text-xl font-semibold">{avgBookingLeadTime.toFixed(1)} dias</p>
          {avgBookingLeadTime > 14 && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Agendamentos com muita antecedência aumentam risco de falta
            </p>
          )}
        </div>

        {/* Recommendations */}
        {riskLevel !== 'low' && (
          <div className="rounded-lg bg-muted p-3 space-y-2">
            <p className="text-sm font-semibold">Recomendações:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {riskLevel === 'high' && (
                <>
                  <li>• Enviar 3+ lembretes antes da consulta</li>
                  <li>• Notificar outros pacientes para chegarem mais cedo</li>
                  <li>• Confirmar presença 24h antes</li>
                </>
              )}
              {riskLevel === 'medium' && (
                <>
                  <li>• Enviar 2 lembretes antes da consulta</li>
                  <li>• Confirmar presença 48h antes</li>
                </>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};