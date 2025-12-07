import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Calendar, Edit, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { appointmentApi, petApi, Appointment } from "@/lib/api";

const statusColors = {
  SCHEDULED: "bg-primary/10 text-primary border-primary/20",
  COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Appointments() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    petId: "",
    dateTime: "",
    reason: "",
    status: "SCHEDULED" as Appointment["status"],
    veterinarianName: "",
    notes: "",
  });

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: appointmentApi.getAll,
  });

  const { data: pets = [] } = useQuery({
    queryKey: ["pets"],
    queryFn: petApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: appointmentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment scheduled successfully");
      closeDialog();
    },
    onError: () => toast.error("Failed to schedule appointment"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Appointment> }) =>
      appointmentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment updated successfully");
      closeDialog();
    },
    onError: () => toast.error("Failed to update appointment"),
  });

  const deleteMutation = useMutation({
    mutationFn: appointmentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment deleted successfully");
    },
    onError: () => toast.error("Failed to delete appointment"),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingAppointment(null);
    setFormData({
      petId: "",
      dateTime: "",
      reason: "",
      status: "SCHEDULED",
      veterinarianName: "",
      notes: "",
    });
  };

  const openEditDialog = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      petId: appointment.petId.toString(),
      dateTime: appointment.dateTime.slice(0, 16),
      reason: appointment.reason,
      status: appointment.status,
      veterinarianName: appointment.veterinarianName || "",
      notes: appointment.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appointmentData = {
      petId: parseInt(formData.petId),
      dateTime: new Date(formData.dateTime).toISOString(),
      reason: formData.reason,
      status: formData.status,
      veterinarianName: formData.veterinarianName,
      notes: formData.notes || undefined,
    };

    if (editingAppointment) {
      updateMutation.mutate({
        id: editingAppointment.id,
        data: appointmentData,
      });
    } else {
      createMutation.mutate(appointmentData);
    }
  };

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.pet?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Appointments</h1>
          <p className="text-muted-foreground">Schedule and manage visits</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-soft">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAppointment
                  ? "Edit Appointment"
                  : "Schedule Appointment"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="pt-2">
                <Label htmlFor="pet">Pet</Label>
                <Select
                  value={formData.petId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, petId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id.toString()}>
                        {pet.name} ({pet.species})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">
                <Label htmlFor="dateTime">Date & Time</Label>
                <Input
                  id="dateTime"
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, dateTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="pt-2">
                <Label htmlFor="reason">Reason/Description</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="e.g., Annual checkup, Vaccination"
                  required
                />
              </div>
              <div className="pt-2">
                <Label htmlFor="veterinarianName">Veterinarian Name</Label>
                <Input
                  id="veterinarianName"
                  value={formData.veterinarianName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      veterinarianName: e.target.value,
                    })
                  }
                  placeholder="Enter veterinarian name"
                  required
                />
              </div>
              {editingAppointment && (
                <div className="pt-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Appointment["status"]) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAppointment ? "Update" : "Schedule"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search appointments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white pl-10"
        />
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              No appointments found
            </p>
            <p className="text-sm text-muted-foreground">
              Schedule your first appointment
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">
                    {appointment.pet?.name || `Pet #${appointment.petId}`}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(appointment.dateTime).toLocaleDateString()} ·{" "}
                    {new Date(appointment.dateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={statusColors[appointment.status]}
                >
                  {appointment.status.charAt(0) +
                    appointment.status.slice(1).toLowerCase()}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-2 pt-0">
                <p className="text-sm text-muted-foreground">
                  {appointment.reason}
                </p>
                {appointment.veterinarianName && (
                  <p className="text-sm text-muted-foreground">
                    Vet: {appointment.veterinarianName}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(appointment)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteMutation.mutate(appointment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
