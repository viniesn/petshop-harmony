import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Customer, Pet, Appointment } from '@/types';

interface PetShopContextType {
  customers: Customer[];
  pets: Pet[];
  appointments: Appointment[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  deleteCustomer: (id: string) => void;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => void;
  updatePet: (id: string, pet: Omit<Pet, 'id' | 'createdAt'>) => void;
  deletePet: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  deleteAppointment: (id: string) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getPetById: (id: string) => Pet | undefined;
  getPetsByCustomerId: (customerId: string) => Pet[];
}

const PetShopContext = createContext<PetShopContextType | undefined>(undefined);

// Sample data
const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '(11) 99999-1234',
    address: 'Rua das Flores, 123 - São Paulo',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@email.com',
    phone: '(11) 98888-5678',
    address: 'Av. Brasil, 456 - São Paulo',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    email: 'ana@email.com',
    phone: '(11) 97777-9012',
    address: 'Rua do Sol, 789 - São Paulo',
    createdAt: new Date('2024-03-10'),
  },
];

const samplePets: Pet[] = [
  {
    id: '1',
    name: 'Thor',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    weight: 32,
    customerId: '1',
    notes: 'Muito brincalhão, gosta de água',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamês',
    age: 2,
    weight: 4,
    customerId: '1',
    notes: 'Tímida com estranhos',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Max',
    species: 'dog',
    breed: 'Bulldog Francês',
    age: 4,
    weight: 12,
    customerId: '2',
    notes: 'Alérgico a alguns shampoos',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '4',
    name: 'Mel',
    species: 'rabbit',
    breed: 'Holland Lop',
    age: 1,
    weight: 2,
    customerId: '3',
    notes: '',
    createdAt: new Date('2024-03-10'),
  },
];

const sampleAppointments: Appointment[] = [
  {
    id: '1',
    petId: '1',
    customerId: '1',
    service: 'grooming',
    date: new Date(),
    time: '09:00',
    status: 'scheduled',
    notes: 'Tosa completa',
    createdAt: new Date(),
  },
  {
    id: '2',
    petId: '2',
    customerId: '1',
    service: 'bath',
    date: new Date(),
    time: '10:30',
    status: 'in-progress',
    notes: '',
    createdAt: new Date(),
  },
  {
    id: '3',
    petId: '3',
    customerId: '2',
    service: 'veterinary',
    date: new Date(),
    time: '14:00',
    status: 'scheduled',
    notes: 'Consulta de rotina',
    createdAt: new Date(),
  },
];

export function PetShopProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [pets, setPets] = useState<Pet[]>(samplePets);
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setCustomers((prev) => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, customer: Omit<Customer, 'id' | 'createdAt'>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...customer } : c))
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    // Also delete associated pets and appointments
    setPets((prev) => prev.filter((p) => p.customerId !== id));
    setAppointments((prev) => prev.filter((a) => a.customerId !== id));
  };

  const addPet = (pet: Omit<Pet, 'id' | 'createdAt'>) => {
    const newPet: Pet = {
      ...pet,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setPets((prev) => [...prev, newPet]);
  };

  const updatePet = (id: string, pet: Omit<Pet, 'id' | 'createdAt'>) => {
    setPets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...pet } : p))
    );
  };

  const deletePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
    // Also delete associated appointments
    setAppointments((prev) => prev.filter((a) => a.petId !== id));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...appointment } : a))
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const getCustomerById = (id: string) => customers.find((c) => c.id === id);
  const getPetById = (id: string) => pets.find((p) => p.id === id);
  const getPetsByCustomerId = (customerId: string) =>
    pets.filter((p) => p.customerId === customerId);

  return (
    <PetShopContext.Provider
      value={{
        customers,
        pets,
        appointments,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addPet,
        updatePet,
        deletePet,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        updateAppointmentStatus,
        getCustomerById,
        getPetById,
        getPetsByCustomerId,
      }}
    >
      {children}
    </PetShopContext.Provider>
  );
}

export function usePetShop() {
  const context = useContext(PetShopContext);
  if (context === undefined) {
    throw new Error('usePetShop must be used within a PetShopProvider');
  }
  return context;
}
