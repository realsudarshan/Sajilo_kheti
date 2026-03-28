// @ts-nocheck
"use client";

import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  
  const subscribeMutation = trpc.push.subscribe.useMutation();

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
      // Auto-sync existing sub to TRPC
      if (sub && !subscribeMutation.isPending) {
        syncSubscription(sub);
      }
    } catch (err) {
      console.error('Service Worker registration failed: ', err);
    }
  };

  const syncSubscription = async (sub: PushSubscription) => {
      const jsonSub = sub.toJSON();
      if (jsonSub.endpoint && jsonSub.keys) {
        await subscribeMutation.mutateAsync({
          endpoint: jsonSub.endpoint,
          keys: {
             p256dh: jsonSub.keys.p256dh!,
             auth: jsonSub.keys.auth!,
          }
        });
      }
  };

  const subscribeToPush = async () => {
    try {
      if (!('Notification' in window)) {
        throw new Error('Browser does not support notifications');
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.error('Notification permission denied');
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string),
      });

      setSubscription(sub);
      await syncSubscription(sub);
      return true;
    } catch (error) {
      console.error("Error subscribing to push notifications", error);
      return false;
    }
  };

  return {
    isSupported,
    subscription,
    subscribeToPush,
    isSubscribing: subscribeMutation.isPending
  };
}
