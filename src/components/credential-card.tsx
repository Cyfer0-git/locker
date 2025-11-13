'use client';

import { useState } from 'react';
import { Credential } from '@/lib/types';
import { useApp } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Copy, KeyRound, Link as LinkIcon, Pencil, Trash2, User } from 'lucide-react';
import { EditItemModal } from './modals/edit-item-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CredentialCardProps {
  credential: Credential;
}

export function CredentialCard({ credential }: CredentialCardProps) {
  const { deleteCredential } = useApp();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to Clipboard',
        description: `${fieldName} has been copied.`,
      });
    });
  };

  const handleDelete = () => {
    deleteCredential(credential.id);
    toast({
      title: 'Credential Deleted',
      description: `"${credential.site}" has been removed.`,
    });
  }

  return (
    <>
      <Card className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow rounded-lg border bg-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-primary uppercase pr-2 break-all">{credential.site}</CardTitle>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the credential for "{credential.site}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-3 text-sm pt-2">
           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditModalOpen(true)}>
                <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
          <p className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <span className="font-medium break-all">
                <span className="font-normal text-muted-foreground">User: </span>
                {credential.user}
            </span>
          </p>
          <p className="flex items-start gap-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
             <span className="font-medium break-all text-xs">
                <span className="font-normal text-muted-foreground">URL: </span>
                 <a href={credential.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {credential.url}
                </a>
            </span>
          </p>
        </CardContent>
        <CardFooter className="flex gap-2 p-2 border-t mt-4">
          <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground" onClick={() => copyToClipboard(credential.user, 'Username')}>
            Copy User
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground" onClick={() => copyToClipboard(credential.pass, 'Password')}>
            Copy Pass
          </Button>
        </CardFooter>
      </Card>
      <EditItemModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        itemType="credential"
        item={credential}
      />
    </>
  );
}
