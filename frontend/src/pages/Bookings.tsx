import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Error from "@/components/Error";

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
      const response = await api.delete(`/user/bookings/${bookingId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Booking deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete booking, please try again.",
      );
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h2>

          {isLoading && <p className="text-gray-600">Loading bookings...</p>}
          {isError && (
            <Error message="Failed to fetch bookings. Please try again later." />
          )}
          {!isLoading && !isError && data?.length === 0 && (
            <p className="text-gray-600">No bookings found yet.</p>
          )}

          <div className="space-y-4">
            {data?.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={booking.cook.image}
                    alt={booking.cook.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{booking.cook.name}</h3>
                    <p className="text-sm text-gray-600">{booking.cook.cuisine}</p>
                    <p className="text-sm text-gray-600">${booking.cook.rate}/hr</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => deleteBooking(booking.id)}
                  disabled={isPending}
                >
                  Cancel Booking
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bookings;
