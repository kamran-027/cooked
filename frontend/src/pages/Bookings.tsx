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
  Sparkles,
  MessageSquare
} from "lucide-react";
import { useState, useMemo } from "react";
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
  status: "BOOKED" | "CANCELLED";
  notes: string | null;
  totalPrice: number;
  cook: {
    id: string;
    name: string;
    cuisine: string;
    rate: number;
    image: string;
  };
  availability?: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
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

  const { mutate: cancelBooking, isPending } = useMutation({
    mutationKey: ["cancel-booking"],
    mutationFn: async (bookingId: string) => {
      setDeletingBookingId(bookingId);
      const response = await api.delete(`/user/bookings/${bookingId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Booking cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setDeletingBookingId(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to cancel booking, please try again.",
      );
      setDeletingBookingId(null);
    },
  });

  const formatBookingDate = (rawDate: string) =>
    new Date(rawDate).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const activeBookingsCount = useMemo(() => {
    return data?.filter((b) => b.status === "BOOKED").length || 0;
  }, [data]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppBar />
      <main className="flex-1 bg-transparent px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <div className="container mx-auto px-0 max-w-5xl">
          <section className="mb-6 rounded-2xl border border-border/80 bg-card p-5 shadow-md sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
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
              Active Bookings: <span className="font-semibold text-foreground">{activeBookingsCount}</span>
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
            <div className="rounded-xl border border-border/70 bg-card p-8 text-center my-6">
              <p className="font-medium text-foreground">No bookings found yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Book a chef from your dashboard to see your sessions here.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {data?.map((booking) => {
              const isCancelled = booking.status === "CANCELLED";
              return (
                <div
                  key={booking.id}
                  className={`flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between ${
                    isCancelled ? "opacity-60 bg-muted/10 border-border/40" : ""
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative">
                      <img
                        src={booking.cook.image}
                        alt={booking.cook.name}
                        className={`h-16 w-16 rounded-xl object-cover shadow-sm ${
                          isCancelled ? "grayscale" : ""
                        }`}
                      />
                      <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border shadow-sm ${
                        isCancelled 
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div>
                      <h3 className={`font-semibold text-lg ${isCancelled ? "line-through text-muted-foreground" : ""}`}>
                        {booking.cook.name}
                      </h3>
                      
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1">
                          <UtensilsCrossed className="h-3.5 w-3.5" />
                          {booking.cook.cuisine}
                        </span>
                        {booking.availability ? (
                          <>
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 text-primary border border-primary/10 px-2.5 py-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {formatBookingDate(booking.availability.date)}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 text-primary border border-primary/10 px-2.5 py-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {booking.availability.startTime} - {booking.availability.endTime}
                            </span>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatBookingDate(booking.createdAt)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 text-slate-100 font-bold px-2.5 py-1 border border-slate-700">
                          Paid: ${booking.totalPrice}
                        </span>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/30 flex items-start gap-2 max-w-xl">
                          <MessageSquare className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                          <span>"{booking.notes}"</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    {isCancelled ? (
                      <span className="text-xs text-muted-foreground font-semibold px-4 py-2 border border-dashed border-border rounded-xl line-through">
                        Session Cancelled
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setBookingToCancel(booking);
                          setAcknowledgeCancel(false);
                        }}
                        disabled={isPending}
                        className="cursor-pointer border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive sm:min-w-40 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingBookingId === booking.id ? "Cancelling..." : "Cancel Session"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
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
              <p className="font-semibold text-foreground text-base">
                {bookingToCancel?.cook.name}
              </p>
              
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  {bookingToCancel?.cook.cuisine}
                </span>
                
                {bookingToCancel?.availability ? (
                  <>
                    <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatBookingDate(bookingToCancel.availability.date)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {bookingToCancel.availability.startTime} - {bookingToCancel.availability.endTime}
                    </span>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {bookingToCancel?.createdAt ? formatBookingDate(bookingToCancel.createdAt) : ""}
                  </span>
                )}
                
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 text-slate-100 font-bold px-2 py-1 border border-slate-700">
                  Total: ${bookingToCancel?.totalPrice}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-muted-foreground">
              <p className="inline-flex items-center gap-2 font-medium text-foreground">
                <ShieldAlert className="h-4 w-4 text-destructive" />
                This slot will be immediately freed
              </p>
              <p className="mt-1">
                Other users will be able to book this timeslot once cancelled.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border/70 bg-background/50 p-3 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-primary"
                checked={acknowledgeCancel}
                onChange={(e) => setAcknowledgeCancel(e.target.checked)}
              />
              <span className="text-muted-foreground select-none">
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
                cancelBooking(bookingToCancel.id, {
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
