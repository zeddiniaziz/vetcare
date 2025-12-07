import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, PawPrint, Edit, Trash2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { petApi, ownerApi, Pet } from '@/lib/api';

export default function Pets() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    age: '',
    ownerId: '',
    gender: '',
  });

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: petApi.getAll,
  });

  const { data: owners = [] } = useQuery({
    queryKey: ['owners'],
    queryFn: ownerApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: petApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet added successfully');
      closeDialog();
    },
    onError: () => toast.error('Failed to add pet'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Pet> }) =>
      petApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet updated successfully');
      closeDialog();
    },
    onError: () => toast.error('Failed to update pet'),
  });

  const deleteMutation = useMutation({
    mutationFn: petApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet deleted successfully');
    },
    onError: () => toast.error('Failed to delete pet'),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingPet(null);
    setFormData({ name: '', species: '', age: '', ownerId: '', gender: '' });
  };

  const openEditDialog = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      age: pet.age?.toString() || '',
      ownerId: pet.ownerId?.toString() || '',
      gender: pet.gender || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const petData = {
      name: formData.name,
      species: formData.species,
      age: formData.age ? parseInt(formData.age) : undefined,
      ownerId: parseInt(formData.ownerId),
      gender: formData.gender || undefined,
    };

    if (editingPet) {
      updateMutation.mutate({ id: editingPet.id, data: petData });
    } else {
      createMutation.mutate(petData);
    }
  };

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Pets</h1>
          <p className="text-muted-foreground">Manage your clinic's patients</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-soft">
              <Plus className="mr-2 h-4 w-4" />
              Add Pet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPet ? 'Edit Pet' : 'Add New Pet'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="">
              <div className="">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="pt-2">
                <Label htmlFor="species">Species</Label>
                <Select
                  value={formData.species}
                  onValueChange={(value) =>
                    setFormData({ ...formData, species: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dog">Dog</SelectItem>
                    <SelectItem value="Cat">Cat</SelectItem>
                    <SelectItem value="Bird">Bird</SelectItem>
                    <SelectItem value="Rabbit">Rabbit</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />
              </div>
              <div className="pt-2">
                <Label htmlFor="owner">Owner</Label>
                <Select
                  value={formData.ownerId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, ownerId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id.toString()}>
                        {owner.firstName} {owner.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPet ? 'Update' : 'Add'} Pet
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
          placeholder="Search pets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {/* Pets Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PawPrint className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              No pets found
            </p>
            <p className="text-sm text-muted-foreground">
              Add your first pet to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPets.map((pet, index) => (
            <Card
              key={pet.id}
              className="group shadow-card transition-all duration-200 hover:shadow-soft hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <PawPrint className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{pet.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {pet.species}
                      {pet.breed && ` • ${pet.breed}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openEditDialog(pet)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => deleteMutation.mutate(pet.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {pet.age && <p>Age: {pet.age} years</p>}
                  {pet.owner && (
                    <p>
                      Owner: {pet.owner.firstName} {pet.owner.lastName}
                    </p>
                  )}
                  {pet.gender && <p>Gender: {pet.gender}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
