"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface JobStatus {
  id: string;
  state: "pending" | "processing" | "completed" | "failed";
  resultUrl?: string;
}

export default function JobPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<JobStatus | null>(null);

  useEffect(() => {
    if (!jobId) return;
    let interval = setInterval(async () => {
      const res = await fetch(`/api/seedance/status?jobId=${jobId}`);
      if (res.ok) {
        const data: JobStatus = await res.json();
        setStatus(data);
        if (data.state === "completed") {
          clearInterval(interval);
          toast({ title: "Video ready!", description: "Your AI video is complete." });
        }
        if (data.state === "failed") {
          clearInterval(interval);
          toast({ title: "Generation failed", variant: "destructive" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [jobId, toast]);

  if (!status) {
    return <div className="p-6">Loading job status…</div>;
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Job {status.id}</h1>
      <Card className="p-6 bg-surface-primary">
        <p className="text-text-primary">
          Status:{" "}
          <span
            className={
              status.state === "completed"
                ? "text-green-400"
                : status.state === "failed"
                ? "text-red-400"
                : "text-text-secondary"
            }
          >
            {status.state}
          </span>
        </p>
        {status.state === "completed" && status.resultUrl && (
          <div className="mt-6">
            <video
              src={status.resultUrl}
              controls
              className="w-full max-w-md mx-auto rounded-lg shadow-md"
            />
            <Button
              className="mt-4"
              onClick={() => router.push("/dashboard")}
            >
              ← Back to Dashboard
            </Button>
          </div>
        )}
        {status.state !== "completed" && status.state !== "failed" && (
          <p className="text-text-secondary mt-4">Please wait while we generate your video…</p>
        )}
      </Card>
    </main>
  );
}
