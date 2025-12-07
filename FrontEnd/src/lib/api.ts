const API_BASE_URL = 'http://localhost:8080/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Handle empty responses (e.g., 204 No Content for DELETE operations)
  const contentType = response.headers.get('content-type');
  if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
    // Return empty object for void responses
    return {} as T;
  }

  // Check if response has content before parsing
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (e) {
    // If it's not JSON, return the text as-is (for string responses)
    return text as unknown as T;
  }
}

// Backend Owner model structure
interface BackendOwner {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Backend Animal model structure
interface BackendAnimal {
  id: number;
  name: string;
  species: string;
  age: number;
  gender: string;
  owner?: BackendOwner;
}

// Backend Appointment model structure
interface BackendAppointment {
  id: number;
  date: string;
  description: string;
  veterinarianName: string;
  status: string;
  animal: BackendAnimal;
}

// Frontend Pet interface (mapped from Animal)
export interface Pet {
  id: number;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  ownerId: number;
  owner?: Owner;
  gender?: string;
}

// Frontend Owner interface
export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Frontend Appointment interface (mapped from backend)
export interface Appointment {
  id: number;
  petId: number;
  pet?: Pet;
  dateTime: string;
  reason: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  veterinarianName?: string;
  notes?: string;
}

// Helper function to map BackendOwner to Owner
function mapOwnerToOwner(owner: BackendOwner): Owner {
  return {
    id: owner.id,
    firstName: owner.firstName,
    lastName: owner.lastName,
    email: owner.email,
    phone: owner.phone,
    address: owner.address,
  };
}

// Helper function to map BackendAnimal to Pet
function mapAnimalToPet(animal: BackendAnimal): Pet {
  return {
    id: animal.id,
    name: animal.name,
    species: animal.species,
    age: animal.age,
    ownerId: animal.owner?.id || 0,
    owner: animal.owner ? mapOwnerToOwner(animal.owner) : undefined,
    gender: animal.gender,
  };
}

// Helper function to map BackendAppointment to Appointment
function mapAppointmentToAppointment(apt: BackendAppointment): Appointment {
  return {
    id: apt.id,
    petId: apt.animal?.id || 0,
    pet: apt.animal ? mapAnimalToPet(apt.animal) : undefined,
    dateTime: apt.date,
    reason: apt.description,
    status: (apt.status as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED') || 'SCHEDULED',
    veterinarianName: apt.veterinarianName,
  };
}

// Helper function to map Pet to BackendAnimal for create/update
function mapPetToAnimal(pet: Partial<Pet>): any {
  const data: any = {
    name: pet.name,
    species: pet.species,
    age: pet.age || 0,
    gender: pet.gender || '',
  };
  
  // Include owner relationship if ownerId is provided
  if (pet.ownerId) {
    data.owner = { id: pet.ownerId };
  }
  
  return data;
}

// Helper function to map Appointment to BackendAppointment for create/update
function mapAppointmentToBackend(apt: Partial<Appointment>, animalId?: number): any {
  return {
    date: apt.dateTime,
    description: apt.reason,
    veterinarianName: apt.veterinarianName || '',
    status: apt.status || 'SCHEDULED',
    animal: animalId ? { id: animalId } : undefined,
  };
}

// Owner API - uses /api/owners endpoint
export const ownerApi = {
  getAll: async (): Promise<Owner[]> => {
    const owners = await fetchApi<BackendOwner[]>('/owners');
    return owners.map(mapOwnerToOwner);
  },
  getById: async (id: number): Promise<Owner> => {
    const owner = await fetchApi<BackendOwner>(`/owners/${id}`);
    return mapOwnerToOwner(owner);
  },
  create: async (owner: Omit<Owner, 'id'>): Promise<Owner> => {
    const created = await fetchApi<BackendOwner>('/owners', {
      method: 'POST',
      body: JSON.stringify(owner),
    });
    return mapOwnerToOwner(created);
  },
  update: async (id: number, owner: Partial<Owner>): Promise<Owner> => {
    const updated = await fetchApi<BackendOwner>(`/owners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(owner),
    });
    return mapOwnerToOwner(updated);
  },
  delete: async (id: number): Promise<void> => {
    await fetchApi<void>(`/owners/${id}`, { method: 'DELETE' });
  },
  search: async (query: string): Promise<Owner[]> => {
    const owners = await fetchApi<BackendOwner[]>(`/owners/search?query=${encodeURIComponent(query)}`);
    return owners.map(mapOwnerToOwner);
  },
};

// Pet API - uses /api/animals endpoint
export const petApi = {
  getAll: async (): Promise<Pet[]> => {
    const animals = await fetchApi<BackendAnimal[]>('/animals');
    return animals.map(mapAnimalToPet);
  },
  getById: async (id: number): Promise<Pet> => {
    const animal = await fetchApi<BackendAnimal>(`/animals/${id}`);
    return mapAnimalToPet(animal);
  },
  getByOwner: async (ownerId: number): Promise<Pet[]> => {
    const animals = await fetchApi<BackendAnimal[]>(`/animals/search?ownerId=${ownerId}`);
    return animals.map(mapAnimalToPet);
  },
  create: async (pet: Omit<Pet, 'id'>): Promise<Pet> => {
    const animalData = mapPetToAnimal(pet) as BackendAnimal;
    const created = await fetchApi<BackendAnimal>('/animals', {
      method: 'POST',
      body: JSON.stringify(animalData),
    });
    return mapAnimalToPet(created);
  },
  update: async (id: number, pet: Partial<Pet>): Promise<Pet> => {
    const animalData = mapPetToAnimal(pet);
    const updated = await fetchApi<BackendAnimal>(`/animals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(animalData),
    });
    return mapAnimalToPet(updated);
  },
  delete: async (id: number): Promise<void> => {
    await fetchApi<void>(`/animals/${id}`, { method: 'DELETE' });
  },
  search: async (query: string): Promise<Pet[]> => {
    const animals = await fetchApi<BackendAnimal[]>(`/animals/search?species=${encodeURIComponent(query)}`);
    return animals.map(mapAnimalToPet);
  },
};

// Appointment API - uses /api/appointments endpoint
export const appointmentApi = {
  getAll: async (): Promise<Appointment[]> => {
    const appointments = await fetchApi<BackendAppointment[]>('/appointments');
    return appointments.map(mapAppointmentToAppointment);
  },
  getById: async (id: number): Promise<Appointment> => {
    const appointment = await fetchApi<BackendAppointment>(`/appointments/${id}`);
    return mapAppointmentToAppointment(appointment);
  },
  getByPet: async (petId: number): Promise<Appointment[]> => {
    const appointments = await fetchApi<BackendAppointment[]>('/appointments');
    return appointments
      .filter(apt => apt.animal?.id === petId)
      .map(mapAppointmentToAppointment);
  },
  getByDate: async (date: string): Promise<Appointment[]> => {
    const appointments = await fetchApi<BackendAppointment[]>('/appointments');
    return appointments
      .filter(apt => apt.date.startsWith(date))
      .map(mapAppointmentToAppointment);
  },
  create: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    const backendData = mapAppointmentToBackend(appointment, appointment.petId);
    const created = await fetchApi<BackendAppointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
    return mapAppointmentToAppointment(created);
  },
  update: async (id: number, appointment: Partial<Appointment>): Promise<Appointment> => {
    const backendData = mapAppointmentToBackend(appointment, appointment.petId);
    const updated = await fetchApi<BackendAppointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
    return mapAppointmentToAppointment(updated);
  },
  delete: async (id: number): Promise<void> => {
    await fetchApi<void>(`/appointments/${id}`, { method: 'DELETE' });
  },
};
