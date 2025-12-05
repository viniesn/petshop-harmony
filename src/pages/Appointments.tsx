import { useState } from 'react';
import { usePetShop } from '@/contexts/PetShopContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Plus, Search, Clock, PawPrint, User, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppointmentStatus, ServiceType, Appointment } from '@/types';
import { toast } from 'sonner';

const serviceLabels: Record<ServiceType, string> = {
  grooming: 'Tosa',
  bath: 'Banho',
  veterinary: 'Veterinário',
  vaccination: 'Vacinação',
  consultation: 'Consulta',
};

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: 'Agendado',
  'in-progress': 'Em Andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

export default function Appointments() {
  const { appointments, getPetById, getCustomerById, updateAppointmentStatus, deleteAppointment } = usePetShop();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredAppointments = appointments
    .filter((apt) => {
      const pet = getPetById(apt.petId);
      const customer = getCustomerById(apt.customerId);
      const matchesSearch =
        pet?.name.toLowerCase().includes(search.toLowerCase()) ||
        customer?.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }
      return b.time.localeCompare(a.time);
    });

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    toast.success('Agendamento excluído com sucesso!');
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsEditDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os atendimentos do Pet Shop
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <AppointmentForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            {editingAppointment && (
              <AppointmentForm 
                appointment={editingAppointment} 
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  setEditingAppointment(null);
                }} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por pet ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="scheduled">Agendados</SelectItem>
              <SelectItem value="in-progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((apt) => {
            const pet = getPetById(apt.petId);
            const customer = getCustomerById(apt.customerId);

            return (
              <Card key={apt.id} className="animate-fade-in shadow-elevated">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
                        <PawPrint className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {pet?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          {customer?.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {format(new Date(apt.date), "dd 'de' MMM", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-coral" />
                        <span className="font-medium">{apt.time}</span>
                      </div>
                      <Badge variant="secondary">
                        {serviceLabels[apt.service]}
                      </Badge>
                      <Badge variant={
                        apt.status === 'completed'
                          ? 'default'
                          : apt.status === 'in-progress'
                          ? 'secondary'
                          : apt.status === 'cancelled'
                          ? 'destructive'
                          : 'outline'
                      }>
                        {statusLabels[apt.status]}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {apt.status === 'scheduled' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateAppointmentStatus(apt.id, 'in-progress')}
                          >
                            Iniciar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      {apt.status === 'in-progress' && (
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                        >
                          Concluir
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(apt)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este agendamento?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(apt.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {apt.notes && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Observações:</span> {apt.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">Nenhum agendamento encontrado</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
