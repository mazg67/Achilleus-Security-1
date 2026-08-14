"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Tracks whether the Supabase Realtime websocket is currently connected. */
export function useRealtimeStatus() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("connection-status")
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return connected;
}
