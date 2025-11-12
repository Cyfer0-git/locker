'use client';

import { useState } from 'react';
import { Credential } from '@/lib/types';
import { useApp } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Copy, KeyRound, Link as LinkIcon, MoreVertical, Pencil, Trash2, User } from 'lucide-react';
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
      <Card className="flex flex-col justify-between min-h-[180px] shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold text-primary uppercase pr-2 break-all">{credential.site}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      <span className="text-destructive">Delete</span>
                    </DropdownMenuItem>
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

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="truncate flex items-center gap-2 pt-2">
            <LinkIcon className="h-4 w-4 flex-shrink-0" />
            <a href={credential.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-xs">
              {credential.url}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{credential.user}</span>
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(credential.user, 'Username')}>
            <User className="h-4 w-4 mr-1" /> Copy User
          </Button>
          <Button variant="secondary" size="sm" onClick={() => copyToClipboard(credential.pass, 'Password')}>
            <KeyRound className="h-4 w-4 mr-1" /> Copy Pass
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
