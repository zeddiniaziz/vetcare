import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Users, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ownerApi, Owner } from '@/lib/api';

export default function Owners() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const { data: owners = [], isLoading } = useQuery({
    queryKey: ['owners'],
    queryFn: ownerApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: ownerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      toast.success('Owner added successfully');
      closeDialog();
    },
    onError: () => toast.error('Failed to add owner'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Owner> }) =>
      ownerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      toast.success('Owner updated successfully');
      closeDialog();
    },
    onError: () => toast.error('Failed to update owner'),
  });

  const deleteMutation = useMutation({
    mutationFn: ownerApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      toast.success('Owner deleted successfully');
    },
    onError: () => toast.error('Failed to delete owner'),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingOwner(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const openEditDialog = (owner: Owner) => {
    setEditingOwner(owner);
    setFormData({
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      phone: owner.phone,
      address: owner.address || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ownerData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address || undefined,
    };

    if (editingOwner) {
      updateMutation.mutate({ id: editingOwner.id, data: ownerData });
    } else {
      createMutation.mutate(ownerData);
    }
  };

  const filteredOwners = owners.filter(
    (owner) =>
      owner.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (owner.email && owner.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Owners</h1>
          <p className="text-muted-foreground">Manage pet owners</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-soft">
              <Plus className="mr-2 h-4 w-4" />
              Add Owner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOwner ? 'Edit Owner' : 'Add New Owner'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="pt-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="pt-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="pt-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="pt-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="pt-2">
                <Label htmlFor="address">Address (optional)</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingOwner ? 'Update' : 'Add'} Owner
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
          placeholder="Search owners..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white pl-10"
        />
      </div>

      {/* Owners Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOwners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              No owners found
            </p>
            <p className="text-sm text-muted-foreground">
              Add your first owner to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOwners.map((owner, index) => (
            <Card
              key={owner.id}
              className="group shadow-card transition-all duration-200 hover:shadow-soft hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {owner.firstName} {owner.lastName}
                    </CardTitle>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openEditDialog(owner)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => deleteMutation.mutate(owner.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {owner.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{owner.email}</span>
                  </div>
                )}
                {owner.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{owner.phone}</span>
                  </div>
                )}
                {owner.address && (
                  <p className="text-sm text-muted-foreground">
                    {owner.address}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
