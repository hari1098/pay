"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Zoom from "react-medium-image-zoom";
import { Payment } from "@/lib/types/payment";

interface PaymentDetailsDialogProps {
  payment: Payment;
}

export function PaymentDetailsDialog({ payment }: PaymentDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return "Bank Transfer";
      case "upi":
        return "UPI";
      case "cash":
        return "Cash";
      default:
        return method
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>Payment info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Payment Method
              </h4>
              <p className="text-sm font-medium">
                {formatPaymentMethod(payment.method)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Amount
              </h4>
              <p className="text-sm font-medium">₹{payment.amount}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Payment Details
            </h4>
            <p className="text-sm">{payment.details}</p>
          </div>

          {payment.proof && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Payment Proof
              </h4>
              <div className="relative rounded-md border overflow-hidden">
                <div className="aspect-video relative">
                  <Zoom>
                    <img
                      src={`/api/images?imageName=${payment.proof.fileName}&loadProof=true`}
                      alt="Payment proof"
                      className="object-contain w-full h-72"
                    />
                  </Zoom>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
