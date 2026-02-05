import React from "react";
import type { Director } from "@/types/licensing";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DirectorTable({
  directors = [],
  onDelete,
  onEdit,
  isDeleting,
}: {
  directors: Director[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  isDeleting?: boolean;
}) {
  return (
    <Card className="p-4">
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Director Type</th>
            <th className="p-2">Appointment Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {directors?.map((d: any) => (
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.name}</td>
              <td className="p-2">{d.director_type}</td>
              <td className="p-2">{d.appointment_date}</td>
              <td className="p-2 flex gap-2">
                <Link href={`/licensing/directors/${d.id}`}>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit?.(d.id)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete?.(d.id)}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export default DirectorTable;
