import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getMedicos } from '@/lib/api';
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
import { Badge } from '@/components/ui/badge';

export default async function MedicosPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 0;
  const size = typeof searchParams.size === 'string' ? Number(searchParams.size) : 10;
  
  const data = await getMedicos(page, size);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Médicos</h1>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/medicos/novo">
            Novo Médico
            <PlusCircle className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Médicos</CardTitle>
          <CardDescription>
            Visualize e gerencie os médicos cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CRM</TableHead>
                <TableHead>Especialidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.map((medico) => (
                <TableRow key={medico.id}>
                  <TableCell className="font-medium">{medico.nome}</TableCell>
                  <TableCell>{medico.email}</TableCell>
                  <TableCell>{medico.crm}</TableCell>
                  <TableCell>
                     <Badge variant="secondary">{medico.especialidade}</Badge>
                  </TableCell>
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
