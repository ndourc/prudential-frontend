"use client";
import React from "react";
import {
  useNotifications,
  useMarkNotificationRead,
} from "@/hooks/useCoreResources";
import { useQuery } from "@tanstack/react-query";
import coreAPI from "@/service/core";
import { Card } from "@/components/ui/card";

export default function NotificationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: notification, isLoading } = useQuery({
    queryKey: ["notification", id],
    queryFn: async () => coreAPI.getNotification(id),
    enabled: !!id,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notification</h1>
      </div>
      <Card className="border border-slate-200 dark:border-slate-700 hover:border-amber-300 p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : notification ? (
          <div className="space-y-2">
            <div>
              <strong>Title:</strong> {notification.title}
            </div>
            <div>
              <strong>Message:</strong> {notification.message}
            </div>
            <div>
              <strong>Type:</strong> {notification.notification_type}
            </div>
            <div>
              <strong>Time:</strong> {notification.created_at}
            </div>
          </div>
        ) : (
          <div>Not found</div>
        )}
      </Card>
    </div>
  );
}
