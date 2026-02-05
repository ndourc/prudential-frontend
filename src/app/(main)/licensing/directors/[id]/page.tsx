"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useDirector } from "@/hooks/useDirectors";
import { Card } from "@/components/ui/card";

export default function DirectorDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: director, isLoading } = useDirector(id);
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Director</h1>
        <div className="flex gap-2">
          <button className="btn" onClick={() => router.back()}>
            Back
          </button>
        </div>
      </div>
      <Card>
        {isLoading ? (
          <div>Loading...</div>
        ) : director ? (
          <div className="space-y-2">
            <div>
              <strong>Name:</strong> {director.name}
            </div>
            <div>
              <strong>Director Type:</strong> {director.director_type}
            </div>
            <div>
              <strong>Appointment date:</strong> {director.appointment_date}
            </div>
            <div>
              <strong>Nationality:</strong> {director.nationality}
            </div>
          </div>
        ) : (
          <div>Not found</div>
        )}
      </Card>
    </div>
  );
}
