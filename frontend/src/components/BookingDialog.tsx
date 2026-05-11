import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChefHat, CircleCheckBig, Clock3 } from "lucide-react";

interface Cook {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  rate: number;
  image: string;
}

interface BookingDialogProps {
  cook: Cook;
  onClose: () => void;
}

const BookingDialog = ({ cook, onClose }: BookingDialogProps) => {
  const queryClient = useQueryClient();

  const { mutate: bookCook, isPending } = useMutation({
    mutationKey: ["create-booking", cook.id],
    mutationFn: async () => {
      const response = await api.post("/user/bookings", { cookId: cook.id });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Booking created successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create booking, please try again.",
      );
    },
  });

  return (
    <Dialog open={true} onOpenChange={onClose} defaultOpen={false}>
      <DialogContent className="overflow-hidden border-border/80 bg-card p-0 sm:max-w-xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-orange-400 to-amber-300" />
        <div className="p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Confirm Your Booking</DialogTitle>
          <DialogDescription>
            Review details before we confirm your booking request.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Booking Summary
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-border/80 bg-background/40 p-3">
          <div className="flex items-center gap-3">
            <img
              src={cook.image}
              alt={cook.name}
              className="h-14 w-14 rounded-lg object-cover"
            />
            <div>
              <p className="font-semibold text-foreground">{cook.name}</p>
              <p className="text-sm text-muted-foreground">{cook.cuisine}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 rounded-xl border border-border/80 bg-background/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <ChefHat className="h-4 w-4" />
              Cuisine
            </span>
            <span className="font-medium">{cook.cuisine}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              Hourly Rate
            </span>
            <span className="font-semibold text-primary">${cook.rate}/hr</span>
          </div>
        </div>

        <div className="mt-4 mb-2 flex w-full items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-xs text-muted-foreground sm:mb-3">
          <CircleCheckBig className="h-4 w-4 text-primary" />
          You can manage or cancel this booking from My Bookings.
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer hover:bg-secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer hover:bg-primary/90"
            onClick={() => bookCook()}
            disabled={isPending}
          >
            {isPending ? "Confirming..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
