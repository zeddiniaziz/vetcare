import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PawPrint, Users, Calendar, Plus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { petApi, ownerApi, appointmentApi } from '@/lib/api';

export default function Dashboard() {
  const { data: pets = [] } = useQuery({
    queryKey: ['pets'],
    queryFn: petApi.getAll,
  });

  const { data: owners = [] } = useQuery({
    queryKey: ['owners'],
    queryFn: ownerApi.getAll,
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentApi.getAll,
  });

  const stats = [
    {
      title: 'Total Pets',
      value: pets.length,
      icon: PawPrint,
      href: '/pets',
      color: 'text-primary',
    },
    {
      title: 'Owners',
      value: owners.length,
      icon: Users,
      href: '/owners',
      color: 'text-accent',
    },
    {
      title: 'Appointments',
      value: appointments.filter((a) => a.status === 'SCHEDULED').length,
      icon: Calendar,
      href: '/appointments',
      color: 'text-secondary-foreground',
    },
  ];

  const upcomingAppointments = appointments
    .filter((a) => a.status === 'SCHEDULED')
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="rounded-2xl gradient-hero p-8 text-primary-foreground shadow-soft">
        <h1 className="text-3xl font-bold sm:text-4xl">Welcome to VetCare</h1>
        <p className="mt-2 text-lg opacity-90">
          Manage your veterinary clinic with ease
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            asChild
            variant="secondary"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Link to="/appointments">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-primary"
          >
            <Link to="/pets">
              <PawPrint className="mr-2 h-4 w-4" />
              Add Pet
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.href}>
              <Card className="group cursor-pointer shadow-card transition-all duration-200 hover:shadow-soft hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{stat.value}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Upcoming Appointments */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Appointments</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link to="/appointments">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No upcoming appointments
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {appointment.pet?.name || `Pet #${appointment.petId}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.reason}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Date(appointment.dateTime).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(appointment.dateTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
