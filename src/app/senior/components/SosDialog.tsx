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
import { Phone, Siren } from 'lucide-react';
import { emergencyContacts } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export function SosDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  const handleCall = (name: string, phone: string) => {
    toast({
      title: `Calling ${name}`,
      description: `Dialing ${phone}`,
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
          <DialogTitle className="flex items-center gap-2 text-xl text-red-600">
            <Siren className="h-6 w-6" />
            SOS - Emergency
          </DialogTitle>
          <DialogDescription>
            Press the button below to call emergency services immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="w-full h-20 text-2xl font-bold flex items-center gap-4"
              onClick={() => handleCall('Emergency Services (119)', '119')}
            >
              <Phone className="h-8 w-8" />
              CALL 119
            </Button>
          </DialogClose>
          
          <Separator />

          <p className="text-sm text-muted-foreground text-center">
            Or, contact a family member or other services:
          </p>

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
