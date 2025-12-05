import { usePetShop } from '@/contexts/PetShopContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AppointmentList } from '@/components/dashboard/AppointmentList';
import { Users, PawPrint, Calendar, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { customers, pets, appointments } = usePetShop();

  const todayAppointments = appointments.filter((apt) => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return (
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear()
    );
  });

  const completedToday = todayAppointments.filter(
    (apt) => apt.status === 'completed'
  ).length;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do seu Pet Shop
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Clientes"
            value={customers.length}
            icon={<Users className="h-6 w-6 text-primary" />}
            trend={{ value: 12, isPositive: true }}
            borderColor="border-l-primary"
          />
          <StatsCard
            title="Pets Cadastrados"
            value={pets.length}
            icon={<PawPrint className="h-6 w-6 text-coral" />}
            trend={{ value: 8, isPositive: true }}
            borderColor="border-l-coral"
          />
          <StatsCard
            title="Agendamentos Hoje"
            value={todayAppointments.length}
            icon={<Calendar className="h-6 w-6 text-secondary" />}
            borderColor="border-l-secondary"
          />
          <StatsCard
            title="Concluídos Hoje"
            value={completedToday}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
            borderColor="border-l-primary"
          />
        </div>

        {/* Today's Appointments */}
        <AppointmentList />
      </div>
    </MainLayout>
  );
}
