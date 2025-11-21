'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import { Credential, CannedMessage, Link } from '@/lib/types';
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

const linkSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Please enter a valid URL'),
});

const formSchemas = {
  credential: credentialSchema,
  message: messageSchema,
  link: linkSchema,
};


type EditItemModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  itemType: 'credential' | 'message' | 'link';
  item: Credential | CannedMessage | Link;
};

export function EditItemModal({ isOpen, onOpenChange, itemType, item }: EditItemModalProps) {
  const { updateCredential, updateMessage, updateLink } = useApp();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = formSchemas[itemType];
  
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (item && isOpen) {
        if (itemType === 'credential') {
            const cred = item as Credential;
            form.reset({
                site: cred.site,
                url: cred.url,
                user: cred.user,
                pass: '', // Always clear password field for security
            });
        } else if (itemType === 'message') {
            const msg = item as CannedMessage;
            form.reset({
                title: msg.title,
                body: msg.body,
            });
        } else if (itemType === 'link') {
            const link = item as Link;
            form.reset({
                name: link.name,
                url: link.url,
            });
        }
    }
  }, [item, itemType, form, isOpen]);


  async function onSubmit(values: any) {
    setIsSubmitting(true);
    if (itemType === 'credential') {
      const cred = item as Credential;
      const dataToUpdate: Partial<Credential> = {
          site: values.site,
          url: values.url,
          user: values.user,
      };
      if (values.pass) {
          dataToUpdate.pass = values.pass;
      }
      await updateCredential(cred.id, dataToUpdate);
      toast({ title: 'Credential Updated', description: `"${values.site}" has been updated.` });
    } else if (itemType === 'message') {
      await updateMessage(item.id, values);
      toast({ title: 'Message Updated', description: `"${values.title}" has been updated.` });
    } else if (itemType === 'link') {
      await updateLink(item.id, values);
      toast({ title: 'Link Updated', description: `"${values.name}" has been updated.` });
    }
    setIsSubmitting(false);
    onOpenChange(false);
  }

  const renderFormFields = () => {
    switch (itemType) {
      case 'credential':
        return (
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
        );
      case 'message':
        return (
          <div className="py-4 space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="body" render={({ field }) => (
              <FormItem><FormLabel>Message Body</FormLabel><FormControl><Textarea rows={6} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        );
      case 'link':
        return (
          <div className="py-4 space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="url" render={({ field }) => (
              <FormItem><FormLabel>URL</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {itemType.charAt(0).toUpperCase() + itemType.slice(1)}</DialogTitle>
          <DialogDescription>Make changes to your saved item below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {renderFormFields()}
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
