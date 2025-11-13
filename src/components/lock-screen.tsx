'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyhole, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  password: z.string().min(1, { message: 'Master Password is required.' }),
});

export function LockScreen() {
  const { unlock } = useApp();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUnlocking(true);
    const success = await unlock(values.password);
    if (!success) {
      toast({
        variant: 'destructive',
        title: 'Unlock Failed',
        description: 'The master password may be incorrect or your data is corrupt. Please try again.',
      });
      form.setError('password', { type: 'manual', message: 'Incorrect password.' });
      setIsUnlocking(false);
    }
    // No need to set isUnlocking to false on success, as the component will unmount
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <LockKeyhole className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Secure Manager</CardTitle>
          <CardDescription>Enter your Master Password to unlock your data vault.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Master Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-xs text-muted-foreground px-1">
                This password is only used in your browser to encrypt and decrypt your data. It is never saved or sent anywhere.
              </p>
              <Button type="submit" className="w-full font-bold py-3 text-base" disabled={isUnlocking}>
                {isUnlocking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  'Unlock'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
