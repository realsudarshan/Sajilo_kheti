"use client";

import { usePushNotifications } from '@/lib/usePushNotifications';
import { Button } from '@/components/ui/button';
import { Bell, BellRing, Loader2 } from 'lucide-react';

export function EnablePushNotifications() {
  const { isSupported, subscription, subscribeToPush, isSubscribing } = usePushNotifications();

  // If not supported by browser (e.g. Safari without PWA), or already subscribed, don't show prompt
  if (!isSupported || subscription) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
      <div className="bg-emerald-100 p-2 rounded-lg">
        <Bell className="w-5 h-5 text-emerald-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm text-emerald-900">Enable Notifications</h4>
        <p className="text-xs text-emerald-700 leading-tight">Get instant alerts for lease requests and payments.</p>
      </div>
      <Button 
        size="sm" 
        onClick={subscribeToPush} 
        disabled={isSubscribing}
        className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"
      >
        {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BellRing className="w-4 h-4 mr-2" />}
        Turn On
      </Button>
    </div>
  );
}
