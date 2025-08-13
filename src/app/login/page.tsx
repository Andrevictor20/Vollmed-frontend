'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { login } from './actions';

export default function LoginPage() {
  const [state, formAction] = useFormState(login, undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        variant: 'destructive',
        title: 'Falha no Login',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Image src="/logo.svg" alt="Voll.med Logo" width={32} height={32} />
            <h1 className="text-2xl font-bold text-primary">Voll.med</h1>
          </div>
          <CardTitle>Bem-vindo de volta!</CardTitle>
          <CardDescription>Use seu e-mail e senha para acessar o painel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@user.com"
                defaultValue="user@user.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                defaultValue="123456"
                required 
              />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
            {state?.message && (
              <p className="text-sm font-medium text-destructive text-center">{state.message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
