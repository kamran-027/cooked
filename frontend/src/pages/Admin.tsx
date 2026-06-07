import { useMemo, useState } from "react";
import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import { useUser } from "@/contexts/UserContext";
import UnAuthorizedTemplate from "@/components/UnAuthorizedTemplate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
}

interface Cook {
  id: string;
  name: string;
  email: string;
  cuisine: string;
  description: string;
  rate: number;
  image: string;
  coverImage?: string;
}

interface CookAvailability {
  id: string;
  cookId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

const Admin = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" });
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [cookForm, setCookForm] = useState({
    name: "",
    email: "",
    rate: "",
    cuisine: "",
    description: "",
    image: "",
    coverImage: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    rate: "",
    cuisine: "",
    description: "",
    image: "",
    coverImage: "",
  });
  const [editingCookId, setEditingCookId] = useState<string | null>(null);

  // Availability state
  const [selectedCookIdForSchedule, setSelectedCookIdForSchedule] = useState<string>("");
  const [scheduleForm, setScheduleForm] = useState({ date: "", startTime: "", endTime: "" });

  const { data: users } = useQuery<User[]>({
    queryKey: ["admin-users"],
    queryFn: async () => (await api.get("/admin/getUsers")).data,
    enabled: user?.role === "ADMIN",
  });

  const { data: cooks } = useQuery<Cook[]>({
    queryKey: ["admin-cooks"],
    queryFn: async () => (await api.get("/admin/getCooks")).data,
    enabled: user?.role === "ADMIN",
  });

  // Fetch slots for selected cook
  const { data: adminSlots } = useQuery<CookAvailability[]>({
    queryKey: ["admin-slots", selectedCookIdForSchedule],
    queryFn: async () => (await api.get(`/admin/cooks/${selectedCookIdForSchedule}/availability`)).data,
    enabled: !!selectedCookIdForSchedule && user?.role === "ADMIN",
  });

  const nonAdminUsers = useMemo(
    () => (users || []).filter((u) => u.role !== "ADMIN"),
    [users],
  );

  const createAdminMutation = useMutation({
    mutationFn: async () => (await api.post("/admin/addAdmin", adminForm)).data,
    onSuccess: (data) => {
      toast.success(data?.message || "Admin created successfully!");
      setAdminForm({ name: "", email: "", password: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create admin.");
    },
  });

  const promoteUserMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/admin/promoteAdmin/${id}`)).data,
    onSuccess: (data) => {
      toast.success(data?.message || "User promoted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to promote user.");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/admin/deleteUser/${id}`)).data,
    onSuccess: (data) => {
      toast.success(data?.message || "User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete user.");
    },
  });

  const addCookMutation = useMutation({
    mutationFn: async () =>
      (
        await api.post("/admin/addCook", {
          ...cookForm,
          rate: Number(cookForm.rate),
        })
      ).data,
    onSuccess: (data) => {
      toast.success(data?.message || "Cook added successfully!");
      setCookForm({
        name: "",
        email: "",
        rate: "",
        cuisine: "",
        description: "",
        image: "",
        coverImage: "",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-cooks"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add cook.");
    },
  });

  const updateCookMutation = useMutation({
    mutationFn: async (payload: { id: string; data: any }) =>
      (
        await api.put(`/admin/updateCook/${payload.id}`, {
          ...payload.data,
          rate: Number(payload.data.rate),
        })
      ).data,
    onSuccess: (data) => {
      toast.success(data?.message || "Cook updated successfully!");
      setEditingCookId(null);
      setEditForm({
        name: "",
        email: "",
        rate: "",
        cuisine: "",
        description: "",
        image: "",
        coverImage: "",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-cooks"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update cook.");
    },
  });

  const deleteCookMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/admin/deleteCook/${id}`)).data,
    onSuccess: (data, id) => {
      toast.success(data?.message || "Cook deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-cooks"] });
      if (selectedCookIdForSchedule === id) {
        setSelectedCookIdForSchedule("");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete cook.");
    },
  });

  // Add availability slot mutation
  const addAvailabilityMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCookIdForSchedule) throw new Error("Please select a cook");
      const response = await api.post(`/admin/cooks/${selectedCookIdForSchedule}/availability`, {
        date: scheduleForm.date,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Slot added successfully!");
      setScheduleForm({ date: "", startTime: "", endTime: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-slots", selectedCookIdForSchedule] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add availability slot.");
    },
  });

  // Delete slot mutation
  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId: string) => (await api.delete(`/admin/availability/${slotId}`)).data,
    onSuccess: (data) => {
      toast.success(data?.message || "Slot deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-slots", selectedCookIdForSchedule] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete slot.");
    },
  });

  if (user?.role !== "ADMIN") {
    return <UnAuthorizedTemplate />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />
      <main className="flex-1 bg-transparent px-4 py-6 sm:px-6 sm:py-8 md:px-8 space-y-6">
        <div className="container mx-auto space-y-6 max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-md">
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <CanvasRevealEffect
                animationSpeed={3.8}
                containerClassName="bg-transparent"
                colors={[
                  [234, 179, 8],
                  [249, 115, 22],
                ]}
                dotSize={2}
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-foreground">Admin Control Center</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage chefs, schedules, users, and access controls with confidence.
              </p>
            </div>
          </div>

          <section className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-semibold">Create Admin</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={adminForm.name} onChange={(e) => setAdminForm((s) => ({ ...s, name: e.target.value }))} />
              <Input placeholder="Email" value={adminForm.email} onChange={(e) => setAdminForm((s) => ({ ...s, email: e.target.value }))} />
              <div className="relative">
                <Input 
                  placeholder="Password" 
                  type={showAdminPassword ? "text" : "password"} 
                  value={adminForm.password} 
                  onChange={(e) => setAdminForm((s) => ({ ...s, password: e.target.value }))} 
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                >
                  {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button className="cursor-pointer" onClick={() => createAdminMutation.mutate()} disabled={createAdminMutation.isPending}>Create Admin</Button>
          </section>

          <section className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-semibold">Promote Users to Admin</h3>
            <div className="space-y-3">
              {nonAdminUsers.length === 0 ? (
                <p className="text-xs text-muted-foreground">No users available for promotion.</p>
              ) : (
                nonAdminUsers.map((u) => (
                  <div key={u.id} className="flex flex-col gap-3 rounded-xl border border-border/80 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <p>{u.name || "Unnamed"} ({u.email})</p>
                    <Button className="cursor-pointer" onClick={() => promoteUserMutation.mutate(u.id)} disabled={promoteUserMutation.isPending}>Promote</Button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-semibold">Add New Cook</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={cookForm.name} onChange={(e) => setCookForm((s) => ({ ...s, name: e.target.value }))} />
              <Input placeholder="Email" value={cookForm.email} onChange={(e) => setCookForm((s) => ({ ...s, email: e.target.value }))} />
              <Input placeholder="Rate" type="number" value={cookForm.rate} onChange={(e) => setCookForm((s) => ({ ...s, rate: e.target.value }))} />
              <Input placeholder="Cuisine" value={cookForm.cuisine} onChange={(e) => setCookForm((s) => ({ ...s, cuisine: e.target.value }))} />
              <Input placeholder="Description" value={cookForm.description} onChange={(e) => setCookForm((s) => ({ ...s, description: e.target.value }))} />
              <Input placeholder="Image URL" value={cookForm.image} onChange={(e) => setCookForm((s) => ({ ...s, image: e.target.value }))} />
              <Input placeholder="Cover Image URL" value={cookForm.coverImage} onChange={(e) => setCookForm((s) => ({ ...s, coverImage: e.target.value }))} />
            </div>
            <div className="flex gap-3">
              <Button className="cursor-pointer" onClick={() => addCookMutation.mutate()} disabled={addCookMutation.isPending}>
                Add Cook
              </Button>
            </div>

            <div className="space-y-3">
              {cooks?.map((cook) => (
                <div key={cook.id} className="flex flex-col gap-3 rounded-xl border border-border/80 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <p>{cook.name} ({cook.email})</p>
                  <div className="flex gap-2">
                    <Button className="cursor-pointer" variant="outline" onClick={() => {
                      setEditingCookId(cook.id);
                      setEditForm({
                        name: cook.name || "",
                        email: cook.email || "",
                        rate: String(cook.rate || ""),
                        cuisine: cook.cuisine || "",
                        description: cook.description || "",
                        image: cook.image || "",
                        coverImage: cook.coverImage || "",
                      });
                    }}>
                      Edit
                    </Button>
                    <Button className="cursor-pointer" variant="destructive" onClick={() => deleteCookMutation.mutate(cook.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Schedule Manager Section */}
          <section className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-semibold">Manage Cook Schedules</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Cook</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="mt-1.5 w-full flex items-center justify-between rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary text-left font-normal"
                    >
                      <span>
                        {selectedCookIdForSchedule
                          ? cooks?.find((c) => c.id === selectedCookIdForSchedule)?.name || "Select Cook"
                          : "-- Choose a Cook --"}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-card border border-border/80 rounded-xl shadow-lg p-1">
                    <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Cooks List
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => setSelectedCookIdForSchedule("")}
                    >
                      -- Clear Selection --
                    </DropdownMenuItem>
                    {cooks === undefined ? (
                      <DropdownMenuItem disabled>Loading cooks...</DropdownMenuItem>
                    ) : (
                      cooks.map((c) => (
                        <DropdownMenuItem
                          key={c.id}
                          className="cursor-pointer flex items-center justify-between"
                          onClick={() => setSelectedCookIdForSchedule(c.id)}
                        >
                          <span>{c.name}</span>
                          <span className="text-xs text-muted-foreground">({c.cuisine})</span>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {selectedCookIdForSchedule && (
                <>
                  <div className="h-px bg-border my-2" />
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Add Availability Slot</h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Date</label>
                        <Input
                          type="date"
                          value={scheduleForm.date}
                          onChange={(e) => setScheduleForm((s) => ({ ...s, date: e.target.value }))}
                          className="mt-1 block"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Start Time</label>
                        <Input
                          placeholder="e.g. 12:00 PM"
                          value={scheduleForm.startTime}
                          onChange={(e) => setScheduleForm((s) => ({ ...s, startTime: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">End Time</label>
                        <Input
                          placeholder="e.g. 03:00 PM"
                          value={scheduleForm.endTime}
                          onChange={(e) => setScheduleForm((s) => ({ ...s, endTime: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => addAvailabilityMutation.mutate()}
                      disabled={addAvailabilityMutation.isPending || !scheduleForm.date || !scheduleForm.startTime || !scheduleForm.endTime}
                      className="cursor-pointer"
                    >
                      {addAvailabilityMutation.isPending ? "Adding Slot..." : "Add Availability Slot"}
                    </Button>
                  </div>

                  <div className="h-px bg-border my-2" />

                  <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Existing Slots</h4>
                    {(!adminSlots || adminSlots.length === 0) ? (
                      <p className="text-xs text-muted-foreground">No availability slots defined for this chef.</p>
                    ) : (
                      <div className="space-y-2">
                        {adminSlots.map((slot) => {
                          const formattedSlotDate = new Date(slot.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          });
                          return (
                            <div
                              key={slot.id}
                              className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/50 p-3 sm:flex-row sm:items-center sm:justify-between text-sm"
                            >
                              <div>
                                <span className="font-semibold text-foreground">{formattedSlotDate}</span>
                                <span className="mx-2 text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{slot.startTime} - {slot.endTime}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  slot.isBooked
                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                }`}>
                                  {slot.isBooked ? "Booked" : "Available"}
                                </span>
                                {!slot.isBooked && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteSlotMutation.mutate(slot.id)}
                                    disabled={deleteSlotMutation.isPending}
                                    className="cursor-pointer text-xs h-7 px-3"
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-semibold">Manage Users</h3>
            <div className="space-y-3">
              {users?.length === 0 ? (
                <p className="text-xs text-muted-foreground">No users registered yet.</p>
              ) : (
                users?.map((u) => (
                  <div key={u.id} className="flex flex-col gap-3 rounded-xl border border-border/80 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <p>{u.name || "Unnamed"} ({u.email}) - {u.role}</p>
                    <Button className="cursor-pointer" variant="destructive" onClick={() => deleteUserMutation.mutate(u.id)}>
                      Delete User
                    </Button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Edit Cook Dialog Modal */}
      <Dialog open={!!editingCookId} onOpenChange={(open) => { if (!open) setEditingCookId(null); }}>
        <DialogContent className="sm:max-w-lg bg-card border border-border/80 rounded-2xl shadow-xl p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold text-foreground">Edit Chef Profile</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Modify the chef details below. Click save to apply changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Name</label>
              <Input value={editForm.name} onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Email</label>
              <Input value={editForm.email} onChange={(e) => setEditForm((s) => ({ ...s, email: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Rate ($/hr)</label>
                <Input type="number" value={editForm.rate} onChange={(e) => setEditForm((s) => ({ ...s, rate: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Cuisine</label>
                <Input value={editForm.cuisine} onChange={(e) => setEditForm((s) => ({ ...s, cuisine: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Description</label>
              <Input value={editForm.description} onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Profile Image URL</label>
              <Input value={editForm.image} onChange={(e) => setEditForm((s) => ({ ...s, image: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Cuisine Cover Image URL</label>
              <Input value={editForm.coverImage} onChange={(e) => setEditForm((s) => ({ ...s, coverImage: e.target.value }))} />
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button variant="outline" className="cursor-pointer" onClick={() => setEditingCookId(null)}>
              Cancel
            </Button>
            <Button 
              className="cursor-pointer" 
              onClick={() => updateCookMutation.mutate({ id: editingCookId!, data: editForm })}
              disabled={updateCookMutation.isPending}
            >
              {updateCookMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Admin;
