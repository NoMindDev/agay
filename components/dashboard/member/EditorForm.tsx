"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicForm from "./BasicForm";
import AccountForm from "./AccountForm";
import AdvanceForm from "./AdvanceForm";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { MemberWithPermission } from "@/lib/type";

export default function EditForm({
  memberId,
  memberData,
}: {
  memberId: string;
  memberData: MemberWithPermission | null;
}) {
  const router = useRouter();
  console.log(memberData);
  return (
    <div className="space-y-5 w-full">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/settings")}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Settings
      </Button>

      {/* Tabs */}
      <Tabs defaultValue="basic" className="w-full space-y-5">
        <TabsList className={cn("grid w-full", "grid-cols-3")}>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="advance">Advance</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicForm memberData={memberData} />
        </TabsContent>
        <TabsContent value="account">
          <AccountForm memberData={memberData} />
        </TabsContent>
        <TabsContent value="advance">
          <AdvanceForm memberData={memberData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
