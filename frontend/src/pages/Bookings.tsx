import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Error from "@/components/Error";
import {
  CalendarDays,
  CircleAlert,
  Clock3,
  ShieldAlert,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Booking {
  id: string;
  createdAt: string;
  cook: {
    id: string;
    name: string;
    cuisine: string;
    rate: number;
    image: string;
  };
}

const Bookings = () => {
  const queryClient = useQueryClient();
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [acknowledgeCancel, setAcknowledgeCancel] = useState(false);

  const { data, isLoading, isError } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await api.get("/user/bookings");
      return response.data;
    },
  });

  const { mutate: deleteBooking, isPending } = useMutation({
    mutationKey: ["delete-booking"],
    mutationFn: async (bookingId: string) => {
      setDeletingBookingId(bookingId);
      const response = await api.delete(`/user/bookings/${bookingId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Booking deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setDeletingBookingId(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete booking, please try again.",
      );
      setDeletingBookingId(null);
    },
  });

  const formatBookingDate = (rawDate: string) =>
    new Date(rawDate).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="flex min-h-screen flex-col">
      <AppBar />
      <main className="flex-1 bg-transparent px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <div className="container mx-auto px-0">
          <section className="mb-6 rounded-2xl border border-border/80 bg-card p-5 shadow-md sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Booking Center
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              My Bookings
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track, review, and manage your upcoming chef sessions.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-xs text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Total active bookings: <span className="font-semibold text-foreground">{data?.length || 0}</span>
            </div>
          </section>

          {isLoading && (
            <div className="rounded-xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">
              Loading your bookings...
            </div>
          )}
          {isError && (
            <Error message="Failed to fetch bookings. Please try again later." />
          )}
          {!isLoading && !isError && data?.length === 0 && (
            <div className="rounded-xl border border-border/70 bg-card p-6 text-center">
              <p className="font-medium text-foreground">No bookings found yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Book a chef from dashboard to see your sessions here.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {data?.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={booking.cook.image}
                    alt={booking.cook.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{booking.cook.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1">
                        <UtensilsCrossed className="h-3.5 w-3.5" />
                        {booking.cook.cuisine}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1">
                        <Clock3 className="h-3.5 w-3.5" />${booking.cook.rate}/hr
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatBookingDate(booking.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBookingToCancel(booking);
                    setAcknowledgeCancel(false);
                  }}
                  disabled={isPending}
                  className="cursor-pointer border-destructive/45 text-destructive hover:bg-destructive/10 hover:text-destructive sm:min-w-40"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingBookingId === booking.id ? "Cancelling..." : "Cancel Session"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Dialog
        open={Boolean(bookingToCancel)}
        onOpenChange={(open) => {
          if (!open && !isPending) {
            setBookingToCancel(null);
            setAcknowledgeCancel(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CircleAlert className="h-5 w-5 text-destructive" />
              Cancel this booking?
            </DialogTitle>
            <DialogDescription>
              You are about to cancel your confirmed session with{" "}
              <span className="font-medium text-foreground">
                {bookingToCancel?.cook.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm">
              <p className="font-medium text-foreground">
                {bookingToCancel?.cook.name}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  {bookingToCancel?.cook.cuisine}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1">
                  <Clock3 className="h-3.5 w-3.5" />${bookingToCancel?.cook.rate}/hr
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {bookingToCancel?.createdAt
                    ? formatBookingDate(bookingToCancel.createdAt)
                    : ""}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-muted-foreground">
              <p className="inline-flex items-center gap-2 font-medium text-foreground">
                <ShieldAlert className="h-4 w-4 text-destructive" />
                This action can’t be undone
              </p>
              <p className="mt-1">
                You will need to create a new booking if you change your mind.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border/70 bg-background/50 p-3 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
                checked={acknowledgeCancel}
                onChange={(e) => setAcknowledgeCancel(e.target.checked)}
              />
              <span className="text-muted-foreground">
                I understand this will permanently cancel this booking.
              </span>
            </label>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setBookingToCancel(null)}
              disabled={isPending}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                if (!bookingToCancel) return;
                deleteBooking(bookingToCancel.id, {
                  onSuccess: () => {
                    setBookingToCancel(null);
                    setAcknowledgeCancel(false);
                  },
                });
              }}
              disabled={isPending || !acknowledgeCancel}
            >
              {isPending ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Bookings;
