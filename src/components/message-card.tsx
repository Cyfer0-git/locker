'use client';

import { useState } from 'react';
import { CannedMessage } from '@/lib/types';
import { useApp } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Copy, Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';
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
      <Card className="flex flex-col justify-between min-h-[180px] shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle 
              onClick={() => setIsViewModalOpen(true)} 
              className="text-xl font-bold text-accent-foreground hover:underline cursor-pointer pr-2 break-all"
              style={{ color: 'hsl(var(--accent-foreground))' }}
            >
              {message.title}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsViewModalOpen(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View/Copy</span>
                </DropdownMenuItem>
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
                        This will permanently delete the message "{message.title}". This action cannot be undone.
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
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="line-clamp-3 text-sm">
            {message.body}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(message.body, 'Message body')}>
            <Copy className="h-4 w-4 mr-1" /> Copy
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIsViewModalOpen(true)}>
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
