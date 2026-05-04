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

interface DeactivateUserDialogProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeactivateUserDialog({
  userId,
  userName,
  isOpen,
  onOpenChange,
}: DeactivateUserDialogProps) {
  const [isDeactivating, setIsDeactivating] = useState(false);
  const queryClient = useQueryClient();

  const handleDeactivate = async () => {
    setIsDeactivating(true);
    try {
      await api.patch(`/users/${userId}/deactivate`);
      toast.success(`User ${userName} has been deactivated`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to deactivate user");
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="z-50">
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to deactivate{" "}
            <span className="font-semibold">{userName}</span>? This user will no
            longer be able to access the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeactivating}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDeactivate}
              disabled={isDeactivating}
            >
              {isDeactivating ? "Deactivating..." : "Deactivate"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
