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
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type RatingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  ratedId: string;
  ratedName: string;
  ratedRole: "doctor" | "patient";
};

export function RatingDialog({
  open,
  onOpenChange,
  appointmentId,
  ratedId,
  ratedName,
  ratedRole,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Avaliação obrigatória",
        description: "Por favor, selecione uma nota",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");

      const { error } = await supabase.from("ratings").insert({
        appointment_id: appointmentId,
        rater_id: session.user.id,
        rated_id: ratedId,
        rating,
        comment: comment || null,
      });

      if (error) throw error;

      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por avaliar",
      });
      
      onOpenChange(false);
      setRating(0);
      setComment("");
    } catch (error: any) {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Avaliar {ratedRole === "doctor" ? "Dr(a)." : ""} {ratedName}
          </DialogTitle>
          <DialogDescription>
            Como foi sua experiência? Sua avaliação nos ajuda a melhorar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Deixe um comentário (opcional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
