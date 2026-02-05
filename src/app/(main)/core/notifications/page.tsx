"use client";
import React from "react";
import {
  useNotifications,
  useMarkNotificationRead,
} from "@/hooks/useCoreResources";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Notification } from "@/types/core";

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications(1);
  const markRead = useMarkNotificationRead();
  const items =
    (Array.isArray(data) ? data : data?.results) || ([] as Notification[]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              /* TODO markAll */
            }}
          >
            Mark all read
          </Button>
        </div>
      </div>
      <Card className="p-4 border border-slate-200 dark:border-slate-700 hover:border-amber-300">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul className="space-y-2">
            {items.map((n: Notification) => (
              <li
                key={String(n.id)}
                className="p-3 border rounded hover:bg-amber-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {n.message?.slice(0, 120)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/core/notifications/${n.id}`}>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => markRead.mutate(String(n.id))}
                    >
                      Mark read
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
