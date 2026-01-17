import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useGetPriceCalculator, usePostPriceCalculator } from "@/fileService/hooks";
import { toast } from "sonner";

export default function ConfirmDialog({ isOpen, onClose, newExpression }: { isOpen: boolean; onClose: () => void; newExpression: string }) {
  const postPriceCalculator = usePostPriceCalculator();
  const { data: currentExpression, refetch } = useGetPriceCalculator();

  const handleConfirm = async () => {
    try {
      await postPriceCalculator.mutateAsync(newExpression);
      toast.success("Calculadora de precios actualizada con éxito");
      refetch();
      onClose();
    } catch (error) {
      toast.error("Error al actualizar la calculadora de precios");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar cambios</DialogTitle>
          <DialogDescription asChild>
            <div className="text-muted-foreground text-sm">
              ¿Estás seguro de que deseas cambiar la calculadora de precios de:
              <pre className="p-2 bg-gray-100 rounded my-2 whitespace-pre-wrap break-all max-h-[150px] overflow-y-auto text-xs">{currentExpression}</pre>
              a:
              <pre className="p-2 bg-gray-100 rounded my-2 whitespace-pre-wrap break-all max-h-[150px] overflow-y-auto text-xs">{newExpression}</pre>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}