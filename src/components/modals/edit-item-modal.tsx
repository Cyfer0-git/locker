'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import { Credential, CannedMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const credentialSchema = z.object({
  site: z.string().min(1, 'Site name is required'),
  url: z.string().url('Please enter a valid URL'),
  user: z.string().min(1, 'Username or email is required'),
  pass: z.string().optional(),
});

const messageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Message body is required'),
});

type EditItemModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  itemType: 'credential' | 'message';
  item: Credential | CannedMessage;
};

export function EditItemModal({ isOpen, onOpenChange, itemType, item }: EditItemModalProps) {
  const { updateCredential, updateMessage } = useApp();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCredential = itemType === 'credential';
  const formSchema = isCredential ? credentialSchema : messageSchema;
  
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (item) {
        if (isCredential) {
            const cred = item as Credential;
            form.reset({
                site: cred.site,
                url: cred.url,
                user: cred.user,
                pass: '',
            });
        } else {
            const msg = item as CannedMessage;
            form.reset({
                title: msg.title,
                body: msg.body,
            });
        }
    }
  }, [item, isCredential, form, isOpen]);


  async function onSubmit(values: any) {
    setIsSubmitting(true);
    if (isCredential) {
      const oldCred = item as Credential;
      const newCredData = {
        site: values.site,
        url: values.url,
        user: values.user,
        pass: values.pass ? values.pass : oldCred.pass,
      };
      updateCredential(item.id, newCredData);
      toast({ title: 'Credential Updated', description: `"${values.site}" has been updated.` });
    } else {
      updateMessage(item.id, values);
      toast({ title: 'Message Updated', description: `"${values.title}" has been updated.` });
    }
    setIsSubmitting(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {isCredential ? 'Credential' : 'Message'}</DialogTitle>
          <DialogDescription>Make changes to your saved item below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isCredential ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <FormField control={form.control} name="site" render={({ field }) => (
                  <FormItem><FormLabel>Site Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="url" render={({ field }) => (
                  <FormItem><FormLabel>Site URL</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="user" render={({ field }) => (
                  <FormItem><FormLabel>Username / Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="pass" render={({ field }) => (
                  <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="text" placeholder="Leave blank to keep old" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="body" render={({ field }) => (
                  <FormItem><FormLabel>Message Body</FormLabel><FormControl><Textarea rows={6} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
