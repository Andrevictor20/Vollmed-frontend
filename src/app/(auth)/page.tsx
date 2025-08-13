import Link from 'next/link';
import { Stethoscope, Users, CalendarPlus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const features = [
    {
      title: 'Gerenciar Médicos',
      description: 'Cadastre, visualize e edite os médicos da sua clínica.',
      link: '/medicos',
      icon: Stethoscope,
      action: 'Ver Médicos',
    },
    {
      title: 'Gerenciar Pacientes',
      description: 'Cadastre, visualize e edite os pacientes da sua clínica.',
      link: '/pacientes',
      icon: Users,
      action: 'Ver Pacientes',
    },
    {
      title: 'Agendar Consulta',
      description: 'Agende uma nova consulta para um paciente com um médico disponível.',
      link: '/consultas/nova',
      icon: CalendarPlus,
      action: 'Agendar Agora',
    },
  ];

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-md">
                    <feature.icon className="h-6 w-6 text-primary" />
                 </div>
                 <CardTitle>{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
               <Button asChild className="w-full">
                  <Link href={feature.link}>{feature.action}</Link>
               </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
