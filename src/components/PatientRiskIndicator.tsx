import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PatientRiskIndicatorProps {
  riskLevel: 'low' | 'medium' | 'high';
  noShowProbability: number;
  isFrequentNoShow: boolean;
}

export const PatientRiskIndicator = ({ 
  riskLevel, 
  noShowProbability, 
  isFrequentNoShow 
}: PatientRiskIndicatorProps) => {
  const getRiskConfig = () => {
    switch (riskLevel) {
      case 'high':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          variant: 'destructive' as const,
          label: 'Alto Risco',
          color: 'text-red-600'
        };
      case 'medium':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          variant: 'default' as const,
          label: 'Médio Risco',
          color: 'text-yellow-600'
        };
      case 'low':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          variant: 'secondary' as const,
          label: 'Baixo Risco',
          color: 'text-green-600'
        };
    }
  };

  const config = getRiskConfig();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={config.variant} className="flex items-center gap-1">
            {config.icon}
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">Predição de Falta: {noShowProbability}%</p>
            {isFrequentNoShow && (
              <p className="text-sm text-destructive">⚠️ Paciente Faltoso Frequente</p>
            )}
            <p className="text-sm text-muted-foreground">
              {riskLevel === 'high' && 'Recomenda-se enviar lembretes adicionais'}
              {riskLevel === 'medium' && 'Monitorar confirmação do paciente'}
              {riskLevel === 'low' && 'Baixa probabilidade de falta'}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};