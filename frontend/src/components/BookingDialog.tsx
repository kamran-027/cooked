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
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            You are about to book {cook.name}. Please confirm your booking.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>
            <strong>Cuisine:</strong> {cook.cuisine}
          </p>
          <p>
            <strong>Rate:</strong> ${cook.rate}/hr
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" className="cursor-pointer hover:bg-secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button className="cursor-pointer hover:bg-primary/90" onClick={() => bookCook()} disabled={isPending}>
            {isPending ? "Booking..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
