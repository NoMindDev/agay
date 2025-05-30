"use client";

import { useEffect, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Calendar, Eye, EyeOff, Lock, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase/client";
import { updateMemberBasicById, updatePasswordById } from "@/app/actions";

export default function ProfilePage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("Name");

  // User info state
  const [user, setUser] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setName(user.user_metadata.name || "Name");
        setUser(user);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleChangePassword = () => {
    // Reset error
    setPasswordError("");

    // Validate passwords
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Show success dialog
    // setIsSuccessDialogOpen(true);

    startTransition(async () => {
      const { error } = JSON.parse(
        await updatePasswordById(user?.id, newPassword)
      );

      if (error || error?.messsage) {
        alert("Error updating member: " + error.message);
        console.error("Error updating member:", error.message);
      } else {
        // Reset form
        setNewPassword("");
        setConfirmPassword("");
        console.log("Member updated successfully:");
      }
    });
  };

  const handleChangeName = async () => {
    // setIsSuccessDialogOpen(true);
    startTransition(async () => {
      const { error } = JSON.parse(await updateMemberBasicById(user.id, name));

      if (error || error?.messsage) {
        console.error("Error updating member:", error.message);
      } else {
        console.log("Member updated successfully:", name);
      }
    });
  };

  return (
    <div className="flex-1 p-6">
      {isLoading ? (
        "Loading user data..."
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <Avatar className="h-24 w-24 mb-4">
              {/* <AvatarImage
              src="/placeholder.svg?height=96&width=96"
              alt="Kuenzang"
            /> */}
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">{name}</h2>
            {/* <p className="text-gray-500">
              Joined the organization at{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p> */}
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="details">User Details</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center border rounded-md p-4">
                      <div className="bg-blue-100 p-2 rounded-md mr-4">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center border rounded-md p-4">
                      <div className="bg-blue-100 p-2 rounded-md mr-4">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Created at</p>
                        <p className="font-medium">
                          {user?.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name Edit Section */}
                  <div className="space-y-2 pt-4">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Button
                      onClick={handleChangeName}
                      className="mt-2 bg-blue-600 hover:bg-blue-700"
                    >
                      {isPending ? "Loading..." : "Save Name"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="new-password"
                        className="block text-sm font-medium"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {passwordError && (
                      <p className="text-red-500 text-sm">{passwordError}</p>
                    )}

                    <div className="pt-2">
                      <Button
                        onClick={handleChangePassword}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Success Dialog */}
          <AlertDialog
            open={isSuccessDialogOpen}
            onOpenChange={setIsSuccessDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Password Changed Successfully
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Your password has been updated successfully. You can now use
                  your new password to log in.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>OK</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
