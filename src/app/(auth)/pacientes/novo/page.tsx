'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createPaciente } from '@/lib/api-client';

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido'),
  endereco: z.object({
    logradouro: z.string().min(1, 'Logradouro é obrigatório'),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    cep: z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    uf: z.string().length(2, 'UF deve ter 2 caracteres'),
    numero: z.string().optional(),
    complemento: z.string().optional(),
  }),
});

export default function NovoPacientePage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      endereco: {
        logradouro: '',
        bairro: '',
        cep: '',
        cidade: '',
        uf: '',
        numero: '',
        complemento: '',
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createPaciente(values);
      toast({
        title: 'Sucesso!',
        description: 'Paciente cadastrado com sucesso.',
      });
      router.push('/pacientes');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: 'Não foi possível cadastrar o paciente. Tente novamente.',
      });
    }
  }

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">Cadastro de Novo Paciente</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Paciente</CardTitle>
          <CardDescription>Preencha os campos abaixo para cadastrar um novo paciente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="nome" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl><Input placeholder="Maria dos Santos" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="maria.santos@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="telefone" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl><Input placeholder="(11) 98888-8888" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="cpf" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl><Input placeholder="123.456.789-00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <h3 className="text-lg font-medium border-t pt-6">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <FormField name="endereco.cep" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl><Input placeholder="00000000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField name="endereco.logradouro" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl><Input placeholder="Avenida Brasil" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="endereco.bairro" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl><Input placeholder="Jardins" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="endereco.cidade" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl><Input placeholder="São Paulo" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="endereco.uf" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <FormControl><Input placeholder="SP" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField name="endereco.numero" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl><Input placeholder="456" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="endereco.complemento" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Complemento</FormLabel>
                    <FormControl><Input placeholder="Casa 2" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" asChild><Link href="/pacientes">Cancelar</Link></Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Cadastro'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
