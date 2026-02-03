'use client';

import { useEffect, useRef } from 'react';
import type { NotificationSettings } from '@/lib/types';

const SETTINGS_KEY = 'careconnect-notification-settings';

// --- Global Audio Management ---
let audio: {
    context: AudioContext;
    gainNode: GainNode;
    intervalId: ReturnType<typeof setInterval> | null;
} | null = null;

function playSound() {
    if (audio) return; // Already playing

    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!context) return;
    
    const gainNode = context.createGain();
    gainNode.connect(context.destination);
    gainNode.gain.setValueAtTime(0.3, context.currentTime);

    const playBeep = () => {
        const oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, context.currentTime);
        oscillator.connect(gainNode);
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.2);
    };

    playBeep(); // Play immediately
    const intervalId = setInterval(playBeep, 1000);

    audio = { context, gainNode, intervalId };

    // Automatically stop after 15 seconds
    setTimeout(stopSound, 15000);
}

function stopSound() {
    if (audio) {
        if (audio.intervalId) {
            clearInterval(audio.intervalId);
        }
        audio.gainNode.gain.exponentialRampToValueAtTime(0.00001, audio.context.currentTime + 1);
        
        const currentAudio = audio; // Capture current audio state
        audio = null; // Prevent new sounds from being stopped by this timeout
        
        setTimeout(() => {
            currentAudio?.context.close();
        }, 1000);
    }
}

// Expose stopSound globally
if (typeof window !== 'undefined') {
    (window as any).stopAlarmSound = stopSound;
}
// --- End Global Audio Management ---


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

  // Global function cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
      if (typeof window !== 'undefined' && (window as any).stopAlarmSound) {
        delete (window as any).stopAlarmSound;
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
