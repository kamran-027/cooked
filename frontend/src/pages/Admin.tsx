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
}

const Admin = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" });
  const [cookForm, setCookForm] = useState({
    name: "",
    email: "",
    rate: "",
    cuisine: "",
    description: "",
    image: "",
  });
  const [editingCookId, setEditingCookId] = useState<string | null>(null);

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
      });
      queryClient.invalidateQueries({ queryKey: ["admin-cooks"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add cook.");
    },
  });

  const updateCookMutation = useMutation({
    mutationFn: async () =>
      (
        await api.put(`/admin/updateCook/${editingCookId}`, {
          ...cookForm,
          rate: Number(cookForm.rate),
        })
      ).data,
    onSuccess: (data) => {
      toast.success(data?.message || "Cook updated successfully!");
      setEditingCookId(null);
      setCookForm({
        name: "",
        email: "",
        rate: "",
        cuisine: "",
        description: "",
        image: "",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-cooks"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update cook.");
    },
  });

  const deleteCookMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/admin/deleteCook/${id}`)).data,
    onSuccess: (data) => {
      toast.success(data?.message || "Cook deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-cooks"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete cook.");
    },
  });

  if (user?.role !== "ADMIN") {
    return <UnAuthorizedTemplate />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />
      <main className="flex-1 p-8 bg-gray-50 space-y-8">
        <div className="container mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-gray-800">Admin Panel</h2>

          <section className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-xl font-semibold">Create Admin</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={adminForm.name} onChange={(e) => setAdminForm((s) => ({ ...s, name: e.target.value }))} />
              <Input placeholder="Email" value={adminForm.email} onChange={(e) => setAdminForm((s) => ({ ...s, email: e.target.value }))} />
              <Input placeholder="Password" type="password" value={adminForm.password} onChange={(e) => setAdminForm((s) => ({ ...s, password: e.target.value }))} />
            </div>
            <Button onClick={() => createAdminMutation.mutate()} disabled={createAdminMutation.isPending}>Create Admin</Button>
          </section>

          <section className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-xl font-semibold">Promote Users to Admin</h3>
            <div className="space-y-3">
              {nonAdminUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between border rounded p-3">
                  <p>{u.name || "Unnamed"} ({u.email})</p>
                  <Button onClick={() => promoteUserMutation.mutate(u.id)} disabled={promoteUserMutation.isPending}>Promote</Button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-xl font-semibold">Manage Cooks</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <Input placeholder="Name" value={cookForm.name} onChange={(e) => setCookForm((s) => ({ ...s, name: e.target.value }))} />
              <Input placeholder="Email" value={cookForm.email} onChange={(e) => setCookForm((s) => ({ ...s, email: e.target.value }))} />
              <Input placeholder="Rate" type="number" value={cookForm.rate} onChange={(e) => setCookForm((s) => ({ ...s, rate: e.target.value }))} />
              <Input placeholder="Cuisine" value={cookForm.cuisine} onChange={(e) => setCookForm((s) => ({ ...s, cuisine: e.target.value }))} />
              <Input placeholder="Description" value={cookForm.description} onChange={(e) => setCookForm((s) => ({ ...s, description: e.target.value }))} />
              <Input placeholder="Image URL" value={cookForm.image} onChange={(e) => setCookForm((s) => ({ ...s, image: e.target.value }))} />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => (editingCookId ? updateCookMutation.mutate() : addCookMutation.mutate())} disabled={addCookMutation.isPending || updateCookMutation.isPending}>
                {editingCookId ? "Update Cook" : "Add Cook"}
              </Button>
              {editingCookId && (
                <Button variant="outline" onClick={() => {
                  setEditingCookId(null);
                  setCookForm({ name: "", email: "", rate: "", cuisine: "", description: "", image: "" });
                }}>
                  Cancel Edit
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {cooks?.map((cook) => (
                <div key={cook.id} className="flex items-center justify-between border rounded p-3">
                  <p>{cook.name} ({cook.email})</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                      setEditingCookId(cook.id);
                      setCookForm({
                        name: cook.name,
                        email: cook.email,
                        rate: String(cook.rate),
                        cuisine: cook.cuisine,
                        description: cook.description,
                        image: cook.image,
                      });
                    }}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => deleteCookMutation.mutate(cook.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-xl font-semibold">Manage Users</h3>
            <div className="space-y-3">
              {users?.map((u) => (
                <div key={u.id} className="flex items-center justify-between border rounded p-3">
                  <p>{u.name || "Unnamed"} ({u.email}) - {u.role}</p>
                  <Button variant="destructive" onClick={() => deleteUserMutation.mutate(u.id)}>
                    Delete User
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
