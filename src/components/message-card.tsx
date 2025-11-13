'use client';

import { useState } from 'react';
import { CannedMessage } from '@/lib/types';
import { useApp } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Copy, Eye, Pencil, Trash2 } from 'lucide-react';
import { EditItemModal } from './modals/edit-item-modal';
import { ViewMessageModal } from './modals/view-message-modal';
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

interface MessageCardProps {
  message: CannedMessage;
}

export function MessageCard({ message }: MessageCardProps) {
  const { deleteMessage } = useApp();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to Clipboard',
        description: `${fieldName} has been copied.`,
      });
    });
  };

  const handleDelete = () => {
    deleteMessage(message.id);
    toast({
      title: 'Message Deleted',
      description: `"${message.title}" has been removed.`,
    });
  }

  return (
    <>
      <Card className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow rounded-lg border">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle 
              onClick={() => setIsViewModalOpen(true)} 
              className="text-lg font-bold text-primary uppercase pr-2 break-all cursor-pointer hover:underline"
            >
              {message.title}
            </CardTitle>
            <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditModalOpen(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the message "{message.title}". This action cannot be undone.
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
          <CardDescription className="line-clamp-3 text-sm">
            {message.body}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex gap-2 p-4 bg-muted/50 border-t mt-4">
          <Button variant="ghost" size="sm" className="flex-1" onClick={() => copyToClipboard(message.body, 'Message body')}>
            <Copy className="h-4 w-4 mr-1" /> Copy
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" onClick={() => setIsViewModalOpen(true)}>
            <Eye className="h-4 w-4 mr-1" /> View
          </Button>
        </CardFooter>
      </Card>
      <EditItemModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        itemType="message"
        item={message}
      />
      <ViewMessageModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        message={message}
      />
    </>
  );
}
