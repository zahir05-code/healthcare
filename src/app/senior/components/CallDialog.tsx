'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone } from 'lucide-react';
import { emergencyContacts } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export function CallDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  const handleCall = (name: string, phone: string) => {
    toast({
      title: `${name}에게 전화하는 중`,
      description: `${phone}으로 전화 거는 중`,
    });
    // On a real device, this would initiate a call
    // window.location.href = `tel:${phone}`;
    console.log(`Calling ${name} at ${phone}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>비상 연락처</DialogTitle>
          <DialogDescription>
            비상시 전화할 사람을 선택하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-2">
          {emergencyContacts.map((contact) => (
            <DialogClose key={contact.id} asChild>
                <Button
                variant="outline"
                className="w-full flex justify-between items-center p-4 h-auto text-left"
                onClick={() => handleCall(contact.name, contact.phone)}
                >
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-base font-semibold">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                    </div>
                </div>
                <Phone className="h-5 w-5 text-primary" />
                </Button>
            </DialogClose>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
