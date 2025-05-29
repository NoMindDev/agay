"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { MemberWithPermission } from "@/lib/type";
import { updateMemberAdvanceById } from "@/app/actions";
import { useTransition } from "react";

const FormSchema = z.object({
  role: z.enum(["ADMIN", "USER"]),
  status: z.enum(["ACTIVE", "RESIGNED"]),
});

export default function AdvanceForm({
  memberData,
}: {
  memberData: MemberWithPermission | null;
}) {
  const roles = ["ADMIN", "USER"];
  const status = ["ACTIVE", "RESIGNED"];
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: memberData?.role,
      status: memberData?.status,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!memberData?.member?.id) {
      console.log("Member ID is not available");
      return;
    }

    startTransition(async () => {
      const { error } = JSON.parse(
        await updateMemberAdvanceById(memberData.member.id, {
          role: data.role,
          status: data.status,
        })
      );

      if (error || error?.messsage) {
        console.error("Error updating member:", error.message);
      } else {
        console.log("Member updated successfully:", data);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role, index) => {
                    return (
                      <SelectItem value={role} key={index}>
                        {role}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {status.map((status, index) => {
                    return (
                      <SelectItem value={status} key={index}>
                        {status}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormDescription>
                status resign mean the user is no longer work here.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="flex gap-2 items-center w-full"
          variant="outline"
        >
          Update
          <Pencil className="w-4 h-4" />
        </Button>
      </form>
    </Form>
  );
}
