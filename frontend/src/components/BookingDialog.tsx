import { useState, useMemo, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  ChefHat, 
  Clock3, 
  CalendarDays, 
  MessageSquare, 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  CalendarCheck,
  Lock,
  Sunrise,
  Sun,
  Moon
} from "lucide-react";

interface Cook {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  rate: number;
  image: string;
  coverImage?: string;
  averageRating?: number;
  reviewCount?: number;
  reviews?: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      name: string;
    };
  }[];
}

interface CookAvailability {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface BookingDialogProps {
  cook: Cook;
  onClose: () => void;
}

// Helper functions for parsing time
function parseTimeToMinutes(timeStr: string): number {
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/^(\d+):(\d+)\s*(AM|PM)?$/);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3];

  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function getDurationInHours(start: string, end: string): number {
  const startMins = parseTimeToMinutes(start);
  const endMins = parseTimeToMinutes(end);
  let diff = endMins - startMins;
  if (diff <= 0) {
    diff += 24 * 60; // spans to next day
  }
  return diff / 60;
}

const BookingDialog = ({ cook, onClose }: BookingDialogProps) => {
  const queryClient = useQueryClient();

  const { data: fullCook } = useQuery<Cook>({
    queryKey: ["cook-details", cook.id],
    queryFn: async () => {
      const response = await api.get(`/user/getCookById/${cook.id}`);
      return response.data;
    },
  });

  const activeCook = fullCook || cook;
  
  // Wizard Step State (Restored to 4 Steps)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Form States
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<CookAvailability | null>(null);
  const [notes, setNotes] = useState<string>("");
  
  // Payment Simulator States
  const [showRazorPay, setShowRazorPay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upiId, setUpiId] = useState("");

  // Fetch slots for this cook (includes both booked and unbooked now)
  const { data: slots, isLoading: isSlotsLoading, isError } = useQuery<CookAvailability[]>({
    queryKey: ["cook-availability", cook.id],
    queryFn: async () => {
      const response = await api.get(`/user/cooks/${cook.id}/availability`);
      return response.data;
    },
  });

  // Group slots by formatted date string
  const groupedSlots = useMemo(() => {
    if (!slots) return {};
    const groups: Record<string, CookAvailability[]> = {};
    slots.forEach((slot) => {
      const d = new Date(slot.date);
      const dateKey = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(slot);
    });
    return groups;
  }, [slots]);

  const datesList = useMemo(() => Object.keys(groupedSlots), [groupedSlots]);

  // SVG Clock drawing helpers
  const getClockCoordinates = (hour: number, radius: number, cx = 110, cy = 110) => {
    const angle = hour * 30;
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const getSectorPath = (startHour: number, endHour: number, radius: number, cx = 110, cy = 110) => {
    const start = getClockCoordinates(startHour, radius, cx, cy);
    const end = getClockCoordinates(endHour, radius, cx, cy);
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y} Z`;
  };

  const sectorsConfig = [
    {
      id: "morning",
      label: "Morning Slot",
      timeRange: "9:00 AM - 12:00 PM",
      startHour: 9,
      endHour: 12,
      midpoint: 10.5,
      getSlot: (slotsList: CookAvailability[]) => 
        slotsList?.find((s) => s.startTime.startsWith("09:") || s.startTime.startsWith("9:")),
      icon: <Sunrise className="h-4 w-4 shrink-0" />,
      colorClass: "from-amber-500/10 to-orange-500/10 border-orange-500/20 text-orange-500"
    },
    {
      id: "afternoon",
      label: "Afternoon Slot",
      timeRange: "1:00 PM - 4:00 PM",
      startHour: 1,
      endHour: 4,
      midpoint: 2.5,
      getSlot: (slotsList: CookAvailability[]) => 
        slotsList?.find((s) => s.startTime.startsWith("01:") || s.startTime.startsWith("1:")),
      icon: <Sun className="h-4 w-4 shrink-0" />,
      colorClass: "from-sky-500/10 to-blue-500/10 border-blue-500/20 text-blue-500"
    },
    {
      id: "evening",
      label: "Evening Slot",
      timeRange: "6:00 PM - 9:00 PM",
      startHour: 6,
      endHour: 9,
      midpoint: 7.5,
      getSlot: (slotsList: CookAvailability[]) => 
        slotsList?.find((s) => s.startTime.startsWith("06:") || s.startTime.startsWith("6:")),
      icon: <Moon className="h-4 w-4 shrink-0" />,
      colorClass: "from-indigo-500/10 to-purple-500/10 border-purple-500/20 text-purple-500"
    }
  ];

  // Determine if a specific date is fully booked (all created slots are isBooked = true)
  const isDateFullyBooked = (dateKey: string) => {
    const dateSlots = groupedSlots[dateKey] || [];
    if (dateSlots.length === 0) return true;
    return dateSlots.every((s) => s.isBooked);
  };

  // Find first available date (not fully booked) to auto-select
  useEffect(() => {
    if (datesList.length > 0 && !selectedDate) {
      const firstAvailableDate = datesList.find((d) => !isDateFullyBooked(d));
      setSelectedDate(firstAvailableDate || datesList[0]);
    }
  }, [datesList, selectedDate]);

  // Helper to strip year from date key for single line display (e.g. "Mon, Jun 8")
  const formatSingleLineDate = (dateKey: string) => {
    const commaIndex = dateKey.lastIndexOf(",");
    if (commaIndex === -1) return dateKey;
    return dateKey.substring(0, commaIndex);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  // Pricing calculations
  const conversionRate = 83;
  const durationHours = selectedSlot ? getDurationInHours(selectedSlot.startTime, selectedSlot.endTime) : 0;
  const totalPriceUSD = activeCook.rate * durationHours;
  const totalPriceINR = Math.round(totalPriceUSD * conversionRate);


  // Backend Booking Mutation
  const { mutate: createBooking } = useMutation({
    mutationFn: async () => {
      if (!selectedSlot) throw new Error("No slot selected");
      const response = await api.post("/user/bookings", {
        cookId: activeCook.id,
        availabilityId: selectedSlot.id,
        notes,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Booking confirmed successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to confirm booking, please try again.",
      );
      setPaymentStatus("idle");
      setShowRazorPay(false);
    },
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
      setTimeout(() => {
        createBooking();
      }, 1000);
    }, 1800);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-4xl w-[95vw] overflow-hidden border-border bg-card p-0 h-[90vh] md:h-[650px] flex flex-col md:flex-row">
        {/* Left Side: Cook Info & Reviews */}
        <div className="hidden md:flex md:w-[350px] shrink-0 border-r border-border/60 bg-muted/5 flex-col md:h-full overflow-hidden select-none">
          {/* Cover Image & Profile Overlay */}
          <div className="h-24 md:h-28 relative shrink-0 w-full overflow-hidden bg-muted">
            {activeCook.coverImage ? (
              <img 
                src={activeCook.coverImage} 
                alt={`${activeCook.cuisine} cuisine`} 
                className="w-full h-full object-cover brightness-[0.85]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary/20 via-primary/10 to-card" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-transparent" />
          </div>

          {/* Profile details */}
          <div className="px-5 pb-4 -mt-10 relative shrink-0 flex flex-col">
            <div className="flex items-end gap-3 mb-2.5">
              <img 
                src={activeCook.image} 
                alt={activeCook.name} 
                className="h-16 w-16 rounded-xl object-cover border-2 border-card shadow-md bg-card"
              />
              <div className="pb-1">
                <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md text-primary mb-1">
                  {activeCook.cuisine} Chef
                </span>
                <h3 className="font-extrabold text-foreground text-base leading-tight">{activeCook.name}</h3>
              </div>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-3">
              {activeCook.description}
            </p>

            <div className="flex items-center justify-between text-xs bg-muted/40 p-2.5 rounded-xl border border-border/40">
              <span className="font-semibold text-muted-foreground">Hourly Rate</span>
              <span className="font-black text-foreground text-sm">${activeCook.rate}/hr</span>
            </div>
          </div>

          {/* Reviews section (Dedicated scroll container on desktop) */}
          <div className="flex-1 min-h-0 border-t border-border/60 flex flex-col p-4 overflow-hidden bg-muted/[0.02]">
            <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5 shrink-0">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              Customer Reviews ({activeCook.reviews?.length || 0})
            </h4>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
              {!activeCook.reviews || activeCook.reviews.length === 0 ? (
                <p className="text-xs text-muted-foreground italic bg-muted/20 border border-border/30 rounded-xl p-3 text-center">
                  No reviews yet for this chef.
                </p>
              ) : (
                activeCook.reviews.map((rev) => (
                  <div key={rev.id} className="rounded-xl border border-border/50 bg-background/50 p-3 text-left space-y-1">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="font-bold text-foreground">{rev.user?.name || "Anonymous"}</span>
                      <div className="flex items-center gap-0.5 font-bold text-amber-500">
                        <span>★</span>
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-muted-foreground leading-normal italic">
                        "{rev.comment}"
                      </p>
                    )}
                    <p className="text-[9px] text-muted-foreground/50 text-right">
                      {new Date(rev.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Wizard steps or payment simulator */}
        <div className="flex-1 flex flex-col min-h-0 h-full bg-card relative">
          {!showRazorPay ? (
            <div className="flex-1 flex flex-col h-full min-h-0">
              {/* PROGRESS STEP BAR */}
              <div className="flex items-center justify-between pl-6 pr-14 py-3.5 border-b border-border/60 bg-muted/20 text-xs font-semibold select-none shrink-0">
                {["Date", "Timeslot", "Requests", "Checkout"].map((name, i) => {
                  const stepNum = i + 1;
                  const isCurrent = step === stepNum;
                  const isCompleted = step > stepNum;
                  return (
                    <div key={name} className="flex items-center gap-1.5">
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center font-extrabold text-[10px] border transition-all ${
                        isCurrent 
                          ? "bg-primary border-primary text-primary-foreground scale-110" 
                          : isCompleted
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                          : "bg-muted border-border text-muted-foreground/50"
                      }`}>
                        {isCompleted ? "✓" : stepNum}
                      </span>
                      <span className={`text-[11px] ${isCurrent ? "inline" : "hidden sm:inline"} ${
                        isCurrent ? "text-foreground font-bold" : "text-muted-foreground/50"
                      }`}>
                        {name}
                      </span>
                      {i < 3 && <span className="text-muted-foreground/25 font-light mx-0.5 hidden sm:inline">➔</span>}
                    </div>
                  );
                })}
              </div>

              {/* Wizard Content Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
                <DialogHeader className="mb-4">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-lg font-bold flex items-center gap-2.5">
                      <img src={activeCook.image} alt={activeCook.name} className="h-7 w-7 rounded-full object-cover border border-border/40 md:hidden shrink-0" />
                      <span>Book {activeCook.name}</span>
                    </DialogTitle>
                    {activeCook.reviewCount !== undefined && activeCook.reviewCount > 0 && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 select-none mr-10 sm:mr-0">
                        <span className="text-amber-500">★</span>
                        <span>{activeCook.averageRating}</span>
                        <span className="text-[10px] text-muted-foreground/80 font-normal">({activeCook.reviewCount})</span>
                      </div>
                    )}
                  </div>
                  <DialogDescription>
                    Complete the details below to reserve your chef session.
                  </DialogDescription>
                </DialogHeader>

                {isSlotsLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-sm text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                    Checking chef availability...
                  </div>
                ) : isError ? (
                  <div className="text-center py-10 text-destructive text-sm font-medium">
                    Failed to load chef availability. Please try again later.
                  </div>
                ) : datesList.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border/80 rounded-2xl bg-muted/20 my-4">
                    <CalendarDays className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
                    <p className="font-semibold text-foreground text-sm">No Open Schedules</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                      Chef {activeCook.name} doesn't have any timeslots assigned. Please contact the administrator.
                    </p>
                  </div>
                ) : (
                  <div className="mt-2">
                    
                    {/* STEP 1: CHOOSE DATE */}
                    {step === 1 && (
                      <div className="space-y-4 animate-fade-in">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Choose a Date</h3>
                          <p className="text-xs text-muted-foreground">Select one of the open dates below to view timeslots on the next step.</p>
                        </div>

                        <div className="flex flex-col gap-2.5 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
                          {datesList.map((dateKey) => {
                            const isActive = selectedDate === dateKey;
                            const bookedOut = isDateFullyBooked(dateKey);
                            const displayStr = formatSingleLineDate(dateKey);
                            const openSlots = (groupedSlots[dateKey] || []).filter(s => !s.isBooked).length;

                            const dateSlots = groupedSlots[dateKey] || [];
                            const morningSlot = dateSlots.find(s => s.startTime.startsWith("09:") || s.startTime.startsWith("9:"));
                            const afternoonSlot = dateSlots.find(s => s.startTime.startsWith("01:") || s.startTime.startsWith("1:"));
                            const eveningSlot = dateSlots.find(s => s.startTime.startsWith("06:") || s.startTime.startsWith("6:"));

                            return (
                              <button
                                key={dateKey}
                                type="button"
                                onClick={() => !bookedOut && handleDateChange(dateKey)}
                                disabled={bookedOut}
                                className={`flex flex-col items-stretch px-3.5 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                                  isActive
                                    ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                                    : bookedOut
                                    ? "opacity-45 cursor-not-allowed border-border/45 bg-muted/30 text-muted-foreground/50"
                                    : "border-border hover:bg-muted/50 text-foreground"
                                }`}
                              >
                                {/* Row 1: Date & Overall Availability */}
                                <div className="flex items-center justify-between w-full">
                                  <span className="flex items-center gap-2 font-bold text-foreground">
                                    <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground/75" />
                                    {displayStr}
                                  </span>
                                  
                                  {bookedOut ? (
                                    <span className="text-[9px] uppercase font-extrabold tracking-wider bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-rose-500">
                                      Fully Booked
                                    </span>
                                  ) : (
                                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border/40">
                                      {openSlots} Slots Open
                                    </span>
                                  )}
                                </div>
                                {/* Row 2: Status of each slot */}
                                <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2.5 border-t border-border/50 w-full text-center">
                                  {/* Morning slot badge */}
                                  <div className={`text-[8px] sm:text-[8.5px] font-bold py-1 px-1 sm:px-1.5 rounded-md border flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                                    !morningSlot 
                                      ? "bg-muted/30 text-muted-foreground/45 border-dashed border-border/60" 
                                      : morningSlot.isBooked 
                                      ? "bg-rose-500/5 text-rose-500/80 border-rose-500/10 line-through opacity-75" 
                                      : "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                                  }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                      !morningSlot ? "bg-muted-foreground/30" : morningSlot.isBooked ? "bg-rose-500" : "bg-emerald-500"
                                    }`} />
                                    9 AM - 12 PM
                                  </div>

                                  {/* Afternoon slot badge */}
                                  <div className={`text-[8px] sm:text-[8.5px] font-bold py-1 px-1 sm:px-1.5 rounded-md border flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                                    !afternoonSlot 
                                      ? "bg-muted/30 text-muted-foreground/45 border-dashed border-border/60" 
                                      : afternoonSlot.isBooked 
                                      ? "bg-rose-500/5 text-rose-500/80 border-rose-500/10 line-through opacity-75" 
                                      : "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                                  }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                      !afternoonSlot ? "bg-muted-foreground/30" : afternoonSlot.isBooked ? "bg-rose-500" : "bg-emerald-500"
                                    }`} />
                                    1 PM - 4 PM
                                  </div>

                                  {/* Evening slot badge */}
                                  <div className={`text-[8px] sm:text-[8.5px] font-bold py-1 px-1 sm:px-1.5 rounded-md border flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                                    !eveningSlot 
                                      ? "bg-muted/30 text-muted-foreground/45 border-dashed border-border/60" 
                                      : eveningSlot.isBooked 
                                      ? "bg-rose-500/5 text-rose-500/80 border-rose-500/10 line-through opacity-75" 
                                      : "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
                                  }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                      !eveningSlot ? "bg-muted-foreground/30" : eveningSlot.isBooked ? "bg-rose-500" : "bg-emerald-500"
                                    }`} />
                                    6 PM - 9 PM
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* STEP 2: CHOOSE TIMESLOT */}
                    {step === 2 && (
                      <div className="space-y-4 animate-fade-in flex flex-col items-center">
                        <div className="w-full text-left">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Select Timeslot</h3>
                          <p className="text-xs text-muted-foreground">
                            Schedules for {formatSingleLineDate(selectedDate)}. Select an available slot on the clock face.
                          </p>
                        </div>
                        {/* SIDE-BY-SIDE CONTAINER FOR CLOCK AND LEGEND */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 w-full justify-between mt-1">
                          {/* Left Column: SVG CLOCK FACE */}
                          <div className="relative flex items-center justify-center w-[190px] h-[190px] select-none shrink-0 mx-auto">
                            <svg width="190" height="190" viewBox="0 0 220 220" className="drop-shadow-md">
                              {/* Clock Background face */}
                              <circle cx="110" cy="110" r="100" className="fill-card stroke-border stroke-[1.5]" />
                              {/* Inner face boundary */}
                              <circle cx="110" cy="110" r="80" className="fill-transparent stroke-border/40 stroke-dashed stroke-[0.75]" />

                              {/* Clock Ticks (Every hour) */}
                              {Array.from({ length: 12 }).map((_, i) => {
                                const inner = getClockCoordinates(i, 76);
                                const outer = getClockCoordinates(i, 80);
                                return (
                                  <line
                                    key={i}
                                    x1={inner.x}
                                    y1={inner.y}
                                    x2={outer.x}
                                    y2={outer.y}
                                    className="stroke-border/70 stroke-[1.5]"
                                  />
                                );
                              })}

                              {/* PREDEFINED SLOTS (ARC WEDGES) */}
                              {sectorsConfig.map((config) => {
                                const dateSlots = groupedSlots[selectedDate] || [];
                                const slot = config.getSlot(dateSlots);
                                const exists = !!slot;
                                const isBooked = slot?.isBooked || false;
                                const isSelected = selectedSlot?.id === slot?.id;

                                // Sector Path
                                const pathStr = getSectorPath(config.startHour, config.endHour, 80);

                                return (
                                  <g key={config.id}>
                                    <path
                                      d={pathStr}
                                      onClick={() => exists && !isBooked && setSelectedSlot(slot)}
                                      className={`transition-all duration-200 cursor-pointer ${
                                        isSelected
                                          ? "fill-primary/25 stroke-primary stroke-[2.5]"
                                          : isBooked
                                          ? "fill-rose-500/10 stroke-rose-500/20 cursor-not-allowed"
                                          : !exists
                                          ? "fill-muted/10 stroke-border/20 cursor-not-allowed stroke-dashed"
                                          : "fill-emerald-500/10 hover:fill-emerald-500/20 stroke-emerald-500/35 hover:stroke-emerald-500/60"
                                      }`}
                                    />
                                  </g>
                                );
                              })}

                              {/* ROTATING CLOCK HAND */}
                              {selectedSlot && (() => {
                                const matchedSector = sectorsConfig.find(sc => {
                                  const slot = sc.getSlot(groupedSlots[selectedDate] || []);
                                  return slot?.id === selectedSlot.id;
                                });
                                if (!matchedSector) return null;
                                const tip = getClockCoordinates(matchedSector.midpoint, 72);
                                return (
                                  <g>
                                    <line
                                      x1="110"
                                      y1="110"
                                      x2={tip.x}
                                      y2={tip.y}
                                      className="stroke-primary stroke-[2.5] stroke-linecap-round transition-all duration-300"
                                    />
                                    <circle
                                      cx={tip.x}
                                      cy={tip.y}
                                      r="4"
                                      className="fill-primary stroke-card stroke-2 transition-all duration-300"
                                    />
                                  </g>
                                );
                              })()}

                              {/* Clock Center Cap */}
                              <circle cx="110" cy="110" r="12" className="fill-card stroke-border stroke-2" />
                              <circle cx="110" cy="110" r="4.5" className="fill-primary" />

                              {/* Hour numbers for 12, 3, 6, 9 */}
                              <text x="110" y="24" textAnchor="middle" className="text-[10px] font-bold fill-muted-foreground/75">12</text>
                              <text x="198" y="113" textAnchor="middle" className="text-[10px] font-bold fill-muted-foreground/75">3</text>
                              <text x="110" y="204" textAnchor="middle" className="text-[10px] font-bold fill-muted-foreground/75">6</text>
                              <text x="22" y="113" textAnchor="middle" className="text-[10px] font-bold fill-muted-foreground/75">9</text>
                            </svg>
                          </div>

                          {/* Right Column: DETAILED LEGEND / SELECTOR DESCRIPTIONS */}
                          <div className="flex-1 flex flex-col justify-center gap-2 bg-muted/20 border border-border/40 rounded-xl p-3.5 w-full">
                            <div className="text-xs font-bold text-foreground mb-1 uppercase tracking-wider text-[10px] text-muted-foreground">Timeslot details</div>
                            {sectorsConfig.map((config) => {
                              const dateSlots = groupedSlots[selectedDate] || [];
                              const slot = config.getSlot(dateSlots);
                              const exists = !!slot;
                              const isBooked = slot?.isBooked || false;
                              const isSelected = selectedSlot?.id === slot?.id;

                              return (
                                <div
                                  key={config.id}
                                  onClick={() => exists && !isBooked && setSelectedSlot(slot)}
                                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
                                    isSelected
                                      ? "border-primary bg-primary/5 text-primary font-bold"
                                      : !exists
                                      ? "opacity-35 border-dashed border-border/80 text-muted-foreground/60 cursor-not-allowed"
                                      : isBooked
                                      ? "opacity-60 bg-rose-500/5 border-rose-500/10 text-rose-500/80 cursor-not-allowed line-through"
                                      : "border-border hover:bg-muted/40 text-foreground cursor-pointer"
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    {config.icon}
                                    {config.label}
                                  </span>
                                  
                                  <span className="text-[9px] uppercase font-extrabold tracking-wider">
                                    {isBooked ? (
                                      <span className="text-rose-500 flex items-center gap-1"><Lock className="h-3 w-3" /> Booked</span>
                                    ) : isSelected ? (
                                      <span className="text-primary flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Selected</span>
                                    ) : exists ? (
                                      <span className="text-emerald-500">Available</span>
                                    ) : (
                                      <span className="text-muted-foreground/50">N/A</span>
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: DIETARY NOTES */}
                    {step === 3 && (
                      <div className="space-y-4 animate-fade-in">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Dietary Preferences & Instructions</h3>
                          <p className="text-xs text-muted-foreground">
                            Provide allergies, ingredient requests, or special menus you want.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <textarea
                            placeholder="Enter preferences (e.g. Vegetarian menu, low-sodium, mild spice, peanut allergies, keto...)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full min-h-[140px] text-sm rounded-xl border border-border bg-transparent p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none shadow-sm"
                          />
                          <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-muted/30 border border-border/40 p-2.5 rounded-xl">
                            <MessageSquare className="h-4 w-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                            <span>
                              Adding instructions is optional. You can also discuss menus directly with the chef once booked.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: REVIEW BOOKING DETAILS & CHECKOUT */}
                    {step === 4 && selectedSlot && (
                      <div className="space-y-4 animate-fade-in">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Review Booking Details</h3>
                          <p className="text-xs text-muted-foreground">Verify details before proceeding to payment checkout.</p>
                        </div>

                        <div className="space-y-3">
                          {/* Schedule details */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="border border-border/80 rounded-xl bg-background p-3 text-xs">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Scheduled Date</span>
                              <p className="font-semibold text-foreground mt-1 flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                                {formatSingleLineDate(selectedDate)}
                              </p>
                            </div>
                            <div className="border border-border/80 rounded-xl bg-background p-3 text-xs">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Session Duration</span>
                              <p className="font-semibold text-foreground mt-1 flex items-center gap-1.5">
                                <Clock3 className="h-3.5 w-3.5 text-primary" />
                                {selectedSlot.startTime} - {selectedSlot.endTime}
                              </p>
                            </div>
                          </div>

                          {/* Notes snippet */}
                          {notes && (
                            <div className="border border-border/80 rounded-xl bg-background p-3 text-xs">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Special Requests</span>
                              <p className="text-muted-foreground mt-1.5 italic font-medium leading-relaxed">
                                "{notes}"
                              </p>
                            </div>
                          )}

                          {/* Payment Sheet */}
                          <div className="rounded-2xl border border-border/80 bg-primary/5 p-4 space-y-2.5">
                            <h5 className="text-xs font-extrabold uppercase tracking-wider text-primary">Cost Receipt</h5>
                            <div className="space-y-1.5 text-xs text-muted-foreground">
                              <div className="flex justify-between">
                                <span>Chef Rate</span>
                                <span>${cook.rate}/hr</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Calculated Hours</span>
                                <span>{durationHours} Hours</span>
                              </div>
                              <div className="h-px bg-border/60 my-2" />
                              <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-foreground text-sm">Total Cost</span>
                                <div className="text-right">
                                  <span className="text-lg font-extrabold text-foreground">${totalPriceUSD}</span>
                                  <span className="text-[11px] text-muted-foreground block font-medium">
                                    (approx. ₹{totalPriceINR.toLocaleString("en-IN")})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* BUTTON BAR - ADAPTS TO STEP */}
              <div className="mt-auto border-t border-border/50 px-6 py-4 flex items-center justify-between bg-muted/10 shrink-0">
                {step > 1 ? (
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setStep((s) => (s - 1) as any)}
                    className="cursor-pointer gap-1.5 text-xs h-9"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer text-xs h-9">
                    Cancel
                  </Button>
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={() => setStep((s) => (s + 1) as any)}
                    disabled={(step === 1 && !selectedDate) || (step === 2 && !selectedSlot)}
                    className="cursor-pointer gap-1.5 text-xs h-9"
                  >
                    Continue
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setShowRazorPay(true)}
                    disabled={!selectedSlot}
                    className="cursor-pointer gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 font-bold text-xs h-9 shadow-md text-white"
                  >
                    <CalendarCheck className="h-3.5 w-3.5" />
                    Book & Pay Now
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* RAZORPAY PAYMENT GATEWAY SIMULATION */
            <div className="bg-[#0f172a] text-slate-100 flex flex-col items-center justify-center p-6 min-h-full h-full relative overflow-y-auto">
              {paymentStatus === "idle" && (
                <div className="w-full max-w-[380px] bg-[#1e293b] rounded-2xl shadow-2xl border border-blue-900/20 overflow-hidden text-slate-200 animate-fade-in my-auto">
                  {/* RazorPay Branding Header */}
                  <div className="bg-[#111827] px-4 py-3 border-b border-slate-700/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black tracking-tight text-white">
                        R
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-blue-400 leading-none">RAZORPAY</p>
                        <p className="text-[8px] text-slate-400 font-semibold tracking-wider">SECURE PAYMENTS</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-slate-400 uppercase leading-none font-bold">Amount to pay</p>
                      <p className="text-base font-black text-white mt-1">₹{totalPriceINR.toLocaleString("en-IN")}.00</p>
                    </div>
                  </div>

                  {/* Merchant Brand Block */}
                  <div className="bg-[#1e293b] px-4 py-3 border-b border-slate-700/30 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <ChefHat className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Cooked Culinary Services</h4>
                      <p className="text-[10px] text-slate-400">Booking: {activeCook.name} ({durationHours} hrs)</p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="grid grid-cols-3 bg-[#111827] border-b border-slate-700/30 text-[10px]">
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`py-2.5 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        paymentMethod === "upi" ? "text-blue-400 bg-[#1e293b] font-bold" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      UPI / QR
                    </button>
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`py-2.5 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        paymentMethod === "card" ? "text-blue-400 bg-[#1e293b] font-bold" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      Cards
                    </button>
                    <button
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`py-2.5 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        paymentMethod === "netbanking" ? "text-blue-400 bg-[#1e293b] font-bold" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      Netbanking
                    </button>
                  </div>

                  {/* Form Body */}
                  <form onSubmit={handlePaymentSubmit} className="p-4 space-y-3">
                    {paymentMethod === "upi" && (
                      <div className="space-y-2.5">
                        <div className="text-center py-1.5 bg-slate-800/40 rounded-lg border border-slate-700/30 flex items-center justify-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">UPI Auto-Approve Mock Active</span>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Virtual Payment Address (VPA)</label>
                          <input
                            type="text"
                            required
                            placeholder="username@okhdfcbank"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="mt-1 w-full bg-slate-900 border border-slate-700/50 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-white placeholder-slate-600"
                          />
                        </div>
                        <p className="text-[9px] text-slate-500 text-center leading-normal">
                          Google Pay, PhonePe, Paytm, BHIM and any standard UPI handles supported.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Card Number</label>
                          <input
                            type="text"
                            required
                            placeholder="4111 2222 3333 4444"
                            maxLength={19}
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails(s => ({ ...s, number: e.target.value }))}
                            className="mt-1 w-full bg-slate-900 border border-slate-700/50 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-white placeholder-slate-600"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Expiry Date</label>
                            <input
                              type="text"
                              required
                              placeholder="MM / YY"
                              maxLength={5}
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails(s => ({ ...s, expiry: e.target.value }))}
                              className="mt-1 w-full bg-slate-900 border border-slate-700/50 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-white placeholder-slate-600"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase">CVV</label>
                            <input
                              type="password"
                              required
                              placeholder="•••"
                              maxLength={3}
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails(s => ({ ...s, cvv: e.target.value }))}
                              className="mt-1 w-full bg-slate-900 border border-slate-700/50 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-white placeholder-slate-600"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails(s => ({ ...s, name: e.target.value }))}
                            className="mt-1 w-full bg-slate-900 border border-slate-700/50 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-white placeholder-slate-600"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "netbanking" && (
                      <div className="space-y-2.5 text-slate-355 text-xs">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Popular Indian Banks</p>
                        <div className="grid grid-cols-2 gap-2">
                          {["State Bank", "HDFC Bank", "ICICI Bank", "Axis Bank"].map((bank) => (
                            <label key={bank} className="flex items-center gap-1.5 p-1.5 bg-slate-900/60 rounded-lg border border-slate-700/40 cursor-pointer hover:border-blue-500/40 text-[11px]">
                              <input type="radio" name="bank" defaultChecked={bank === "HDFC Bank"} className="accent-blue-500" />
                              <span>{bank}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button type="submit" className="w-full mt-2 cursor-pointer bg-blue-600 hover:bg-blue-500 font-bold py-3 text-white flex items-center justify-center gap-2 text-xs rounded-lg h-9">
                      Pay ₹{totalPriceINR.toLocaleString("en-IN")}
                    </Button>
                  </form>

                  {/* Footer security branding */}
                  <div className="bg-[#111827] px-4 py-2.5 border-t border-slate-700/30 flex items-center justify-between text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                      Secure Transaction
                    </div>
                    <span>Razorpay Trusted</span>
                  </div>
                </div>
              )}

              {/* PROCESSING SCREEN */}
              {paymentStatus === "processing" && (
                <div className="flex flex-col items-center justify-center text-center animate-fade-in my-auto">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-3" />
                  <h3 className="text-base font-bold text-white">Processing Payment</h3>
                  <p className="text-[11px] text-slate-455 mt-1 max-w-[240px] leading-relaxed">
                    Communicating securely with RazorPay. Please do not close or refresh.
                  </p>
                </div>
              )}

              {/* SUCCESS SCREEN */}
              {paymentStatus === "success" && (
                <div className="flex flex-col items-center justify-center text-center animate-bounce-in my-auto">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3 stroke-[2.5]" />
                  <h3 className="text-base font-bold text-white">Payment Successful</h3>
                  <p className="text-[11px] text-slate-455 mt-1 max-w-[240px] leading-relaxed">
                    ₹{totalPriceINR.toLocaleString("en-IN")} received! Confirming reservation...
                  </p>
                </div>
              )}

              {/* Back button (Only if not processing or success) */}
              {paymentStatus === "idle" && (
                <button
                  onClick={() => {
                    setShowRazorPay(false);
                    setPaymentStatus("idle");
                  }}
                  className="mt-4 text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Go back and edit timeslot
                </button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
