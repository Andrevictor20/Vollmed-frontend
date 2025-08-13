'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createConsulta, getAllMedicos, getAllPacientes } from '@/lib/api-client';
import type { DadosListagemMedico, DadosListagemPaciente } from '@/lib/types';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  idPaciente: z.string().min(1, 'Paciente é obrigatório'),
  especialidade: z.enum(['ORTOPEDIA', 'CARDIOLOGIA', 'GINECOLOGIA', 'DERMATOLOGIA']).optional(),
  idMedico: z.string().optional(),
  data: z.date({ required_error: 'Data e hora são obrigatórios' }),
}).refine(data => {
  return !data.especialidade || data.idMedico;
}, {
  message: 'Selecione um médico se uma especialidade for escolhida.',
  path: ['idMedico']
});


export default function NovaConsultaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pacientes, setPacientes] = useState<DadosListagemPaciente[]>([]);
  const [medicos, setMedicos] = useState<DadosListagemMedico[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const especialidade = form.watch('especialidade');
  
  const medicosFiltrados = especialidade 
    ? medicos.filter(m => m.especialidade === especialidade) 
    : medicos;

  useEffect(() => {
    async function fetchData() {
      try {
        const [pacientesRes, medicosRes] = await Promise.all([
          getAllPacientes(),
          getAllMedicos(),
        ]);
        setPacientes(pacientesRes.content);
        setMedicos(medicosRes.content);
      } catch (error) {
         toast({ variant: 'destructive', title: 'Erro ao carregar dados', description: 'Não foi possível buscar médicos e pacientes.'})
      }
    }
    fetchData();
  }, [toast]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createConsulta({
        ...values,
        idPaciente: Number(values.idPaciente),
        idMedico: values.idMedico ? Number(values.idMedico) : undefined,
        data: values.data.toISOString(),
      });
      toast({
        title: 'Sucesso!',
        description: 'Consulta agendada com sucesso.',
      });
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao agendar',
        description: 'Não foi possível agendar a consulta. Verifique as regras de agendamento.',
      });
    }
  }

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">Agendamento de Consulta</h1>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Nova Consulta</CardTitle>
          <CardDescription>Preencha os campos para agendar uma nova consulta.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField name="idPaciente" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paciente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione o paciente" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {pacientes.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="data" control={form.control} render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data e Hora</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                            {field.value ? format(field.value, 'PPP HH:mm', { locale: ptBR }) : <span>Escolha uma data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < new Date('1900-01-01')} initialFocus />
                         <div className="p-3 border-t border-border">
                            <input type="time" className="w-full border-input rounded-md p-1" onChange={e => {
                                const newDate = new Date(field.value || new Date());
                                const [hours, minutes] = e.target.value.split(':');
                                newDate.setHours(Number(hours), Number(minutes));
                                field.onChange(newDate);
                            }}/>
                         </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="especialidade" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidade (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione a especialidade" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="ORTOPEDIA">Ortopedia</SelectItem>
                        <SelectItem value="CARDIOLOGIA">Cardiologia</SelectItem>
                        <SelectItem value="GINECOLOGIA">Ginecologia</SelectItem>
                        <SelectItem value="DERMATOLOGIA">Dermatologia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField name="idMedico" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médico (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={medicosFiltrados.length === 0}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione o médico" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {medicosFiltrados.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              
              <div className="flex justify-end gap-2 pt-8">
                <Button type="button" variant="outline" asChild><Link href="/">Cancelar</Link></Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Agendando...' : 'Agendar Consulta'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
