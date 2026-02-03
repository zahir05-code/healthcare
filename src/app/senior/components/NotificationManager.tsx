'use client';

import { useEffect, useRef } from 'react';
import type { NotificationSettings } from '@/lib/types';

const SETTINGS_KEY = 'careconnect-notification-settings';

function playSound() {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!context) return;
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, context.currentTime);
    oscillator.frequency.linearRampToValueAtTime(880, context.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
}


export function NotificationManager() {
  const lastCheckedMinute = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    const checkTime = () => {
      const now = new Date();
      const currentMinute = now.getHours() * 60 + now.getMinutes();

      // Only run once per minute
      if (currentMinute === lastCheckedMinute.current) {
        return;
      }
      lastCheckedMinute.current = currentMinute;
      
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (!savedSettings || Notification.permission !== 'granted') {
        return;
      }

      try {
        const settings: NotificationSettings = JSON.parse(savedSettings);
        
        settings.forEach(alarm => {
          if (alarm.enabled) {
            const [alarmHour, alarmMinute] = alarm.time.split(':').map(Number);
            const alarmTotalMinutes = alarmHour * 60 + alarmMinute;

            if (currentMinute === alarmTotalMinutes) {
              new Notification(`⏰ ${alarm.label}`, {
                body: '설정하신 알림 시간입니다!',
                vibrate: [200, 100, 200],
              });
              playSound();
            }
          }
        });
      } catch (e) {
        console.error("Failed to process notifications:", e);
      }
    };

    const intervalId = setInterval(checkTime, 10000); 

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return null; // This component doesn't render anything
}
