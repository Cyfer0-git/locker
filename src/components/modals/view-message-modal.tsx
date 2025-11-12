'use client';

import { CannedMessage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Sparkles, Loader2 } from 'lucide-react';
import { generateDynamicMessage } from '@/ai/flows/generate-dynamic-message';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';

interface ViewMessageModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  message: CannedMessage;
}

export function ViewMessageModal({ isOpen, onOpenChange, message }: ViewMessageModalProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBody, setCurrentBody] = useState(message.body);

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Reset body when closing
      setCurrentBody(message.body);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to Clipboard',
        description: `Message has been copied.`,
      });
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const clipboardContent = await navigator.clipboard.readText();
      if (!clipboardContent) {
        toast({
          variant: 'destructive',
          title: 'Clipboard is Empty',
          description: 'Copy some text to your clipboard to use as context for the AI.',
        });
        setIsGenerating(false);
        return;
      }

      const result = await generateDynamicMessage({
        messageBody: currentBody,
        clipboardContent,
      });

      if (result.dynamicContent) {
        setCurrentBody(prev => `${prev}\n\n${result.dynamicContent}`);
        toast({
          title: 'AI Content Generated',
          description: 'Dynamic content has been added to your message.',
        });
      }
    } catch (error) {
      console.error('AI generation or clipboard error:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Could not read clipboard or generate content. Make sure you have granted clipboard permissions.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{message.title}</DialogTitle>
          <DialogDescription>View, copy, or enhance your message with AI.</DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <label htmlFor="message-body" className="text-sm font-medium">Message Content</label>
          <Textarea
            id="message-body"
            value={currentBody}
            onChange={(e) => setCurrentBody(e.target.value)}
            className="h-64 resize-none"
          />
        </div>

        <DialogFooter className="sm:justify-between gap-2">
           <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate with AI
          </Button>
          <Button onClick={() => copyToClipboard(currentBody)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
