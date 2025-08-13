import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getPacientes } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaginationControls } from '@/components/pagination-controls';

export default async function PacientesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 0;
  const size = typeof searchParams.size === 'string' ? Number(searchParams.size) : 10;
  
  const data = await getPacientes(page, size);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Pacientes</h1>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/pacientes/novo">
            Novo Paciente
            <PlusCircle className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            Visualize e gerencie os pacientes cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CPF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.map((paciente) => (
                <TableRow key={paciente.id}>
                  <TableCell className="font-medium">{paciente.nome}</TableCell>
                  <TableCell>{paciente.email}</TableCell>
                  <TableCell>{paciente.cpf}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t">
           <PaginationControls 
            currentPage={data.number}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            size={data.size}
          />
        </div>
      </Card>
    </>
  );
}
