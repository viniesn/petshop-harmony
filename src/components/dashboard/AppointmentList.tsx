import { usePetShop } from '@/contexts/PetShopContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, PawPrint, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const serviceLabels: Record<string, string> = {
  grooming: 'Tosa',
  bath: 'Banho',
  veterinary: 'Veterinário',
  vaccination: 'Vacinação',
  consultation: 'Consulta',
};

const statusLabels: Record<string, string> = {
  scheduled: 'Agendado',
  'in-progress': 'Em Andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

export function AppointmentList() {
  const { appointments, getPetById, getCustomerById, updateAppointmentStatus } = usePetShop();

  const todayAppointments = appointments
    .filter((apt) => {
      const today = new Date();
      const aptDate = new Date(apt.date);
      return (
        aptDate.getDate() === today.getDate() &&
        aptDate.getMonth() === today.getMonth() &&
        aptDate.getFullYear() === today.getFullYear()
      );
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Card className="animate-slide-up shadow-elevated">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Agendamentos de Hoje
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todayAppointments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum agendamento para hoje
          </p>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map((apt) => {
              const pet = getPetById(apt.petId);
              const customer = getCustomerById(apt.customerId);

              return (
                <div
                  key={apt.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:shadow-soft"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                      <PawPrint className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{pet?.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {apt.time}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        {customer?.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      {serviceLabels[apt.service]}
                    </Badge>
                    <Badge
                      variant={
                        apt.status === 'completed'
                          ? 'default'
                          : apt.status === 'in-progress'
                          ? 'secondary'
                          : apt.status === 'cancelled'
                          ? 'destructive'
                          : 'outline'
                      }
                    >
                      {statusLabels[apt.status]}
                    </Badge>

                    {apt.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(apt.id, 'in-progress')}
                      >
                        Iniciar
                      </Button>
                    )}
                    {apt.status === 'in-progress' && (
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                      >
                        Concluir
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
