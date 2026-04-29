"use client";

import { ManagementLoginForm } from "@/components/mgmt/login-form";

export default function ManagementLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Management Login
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the management dashboard
          </p>
        </div>
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <ManagementLoginForm
            onSuccess={() => {
              window.location.href = "/mgmt/dashboard";
            }}
          />
        </div>
      </div>
    </div>
  );
}
