"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function InviteAgentPage() {
  const router = useRouter();
  const [email, setEmail] = useState("johndoe@gmail.com");
  const [confirmationCode, setConfirmationCode] = useState("AU123JLA9");
  const [showDialog, setShowDialog] = useState(false);

  const handleCancel = () => {
    router.push("/dashboard/settings");
  };

  const handleInvite = () => {
    // Add validation if needed here
    console.log(
      `Inviting agent with email: ${email} and code: ${confirmationCode}`
    );
    router.push("/dashboard/settings");
  };

  const generateCode = () => {
    const randomCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    setConfirmationCode(randomCode);
  };

  return (
    <div className="flex-1 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-orange-400 flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-2xl font-semibold mb-2">Invite Agent</h1>
        <p className="text-gray-500 mb-8">
          Invite an agent to join your organization.
        </p>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium">
              Confirmation Code
            </label>
            <div className="flex gap-2">
              <Input
                id="code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={generateCode}
                className="bg-black text-white hover:bg-gray-800"
              >
                Generate
              </Button>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button variant="outline" className="w-full" onClick={handleCancel}>
              Cancel
            </Button>

            {/* AlertDialog for Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full bg-black hover:bg-gray-800">
                  Invite
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to invite <strong>{email}</strong> with code{" "}
                    <strong>{confirmationCode}</strong>. Please confirm the
                    details before proceeding.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleInvite}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
