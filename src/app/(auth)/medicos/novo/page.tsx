'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createMedico } from '@/lib/api-client';

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  crm: z.string().regex(/^\d{4,6}$/, 'CRM deve ter de 4 a 6 dígitos'),
  especialidade: z.enum(['ORTOPEDIA', 'CARDIOLOGIA', 'GINECOLOGIA', 'DERMATOLOGIA']),
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

export default function NovoMedicoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      crm: '',
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
      await createMedico(values);
      toast({
        title: 'Sucesso!',
        description: 'Médico cadastrado com sucesso.',
      });
      router.push('/medicos');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: 'Não foi possível cadastrar o médico. Tente novamente.',
      });
    }
  }

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">Cadastro de Novo Médico</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Médico</CardTitle>
          <CardDescription>Preencha os campos abaixo para cadastrar um novo médico.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="nome" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl><Input placeholder="Dr. João da Silva" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="joao.silva@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="telefone" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl><Input placeholder="(11) 99999-9999" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="crm" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>CRM</FormLabel>
                    <FormControl><Input placeholder="123456" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="especialidade" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidade</FormLabel>
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
                    <FormControl><Input placeholder="Rua das Flores" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="endereco.bairro" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl><Input placeholder="Centro" {...field} /></FormControl>
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
                    <FormControl><Input placeholder="123" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="endereco.complemento" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Complemento</FormLabel>
                    <FormControl><Input placeholder="Apto 101" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" asChild><Link href="/medicos">Cancelar</Link></Button>
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
