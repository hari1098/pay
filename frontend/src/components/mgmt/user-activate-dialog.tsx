"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ActivateUserDialogProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivateUserDialog({
  userId,
  userName,
  isOpen,
  onOpenChange,
}: ActivateUserDialogProps) {
  const [isActivating, setIsActivating] = useState(false);
  const queryClient = useQueryClient();

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      await api.patch(`/users/${userId}/activate`);
      toast.success(`User ${userName} has been activated`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to activate user");
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="z-50">
        <AlertDialogHeader>
          <AlertDialogTitle>Activate User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to activate{" "}
            <span className="font-semibold">{userName}</span>? This user will be
            able to access the system again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isActivating}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="default"
              onClick={handleActivate}
              disabled={isActivating}
            >
              {isActivating ? "Activating..." : "Activate"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
