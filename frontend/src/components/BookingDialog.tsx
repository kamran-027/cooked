import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

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
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;