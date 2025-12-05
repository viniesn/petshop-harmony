export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed: string;
  age: number;
  weight: number;
  customerId: string;
  notes: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  petId: string;
  customerId: string;
  service: 'grooming' | 'bath' | 'veterinary' | 'vaccination' | 'consultation';
  date: Date;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  createdAt: Date;
}

export type ServiceType = Appointment['service'];
export type PetSpecies = Pet['species'];
export type AppointmentStatus = Appointment['status'];
