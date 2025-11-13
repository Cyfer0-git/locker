'use client';

import { useState } from 'react';
import { Link } from '@/lib/types';
import { useApp } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Copy, ExternalLink, Pencil, Trash2 } from 'lucide-react';
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

interface LinkCardProps {
  link: Link;
}

export function LinkCard({ link }: LinkCardProps) {
  const { deleteLink } = useApp();
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
    deleteLink(link.id);
    toast({
      title: 'Link Deleted',
      description: `"${link.name}" has been removed.`,
    });
  }

  return (
    <>
      <Card className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow rounded-lg border bg-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-primary uppercase pr-2 break-all">{link.name}</CardTitle>
             <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditModalOpen(true)}>
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
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
                        This will permanently delete the link "{link.name}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow pt-2">
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline break-all">
            {link.url}
          </a>
        </CardContent>
        <CardFooter className="flex gap-2 p-2 border-t mt-4">
          <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground" onClick={() => copyToClipboard(link.url, 'URL')}>
            <Copy className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
            </Button>
          </a>
        </CardFooter>
      </Card>
      <EditItemModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        itemType="link"
        item={link}
      />
    </>
  );
}
