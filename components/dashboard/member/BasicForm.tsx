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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { MemberWithPermission } from "@/lib/type";
import { updateMemberBasicById } from "@/app/actions";
import { useTransition } from "react";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export default function BasicForm({
  memberData,
}: {
  memberData: MemberWithPermission | null;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: memberData?.member?.name || "",
    },
  });
  const [isPending, startTransition] = useTransition();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!memberData?.member?.id) {
      console.log("Member ID is not available");
      return;
    }

    startTransition(async () => {
      const { error } = JSON.parse(
        await updateMemberBasicById(memberData.member.id, data.name)
      );

      if (error || error?.messsage) {
        console.error("Error updating member:", error.message);
      } else {
        console.log("Member updated successfully:", data.name);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="flex gap-2 items-center w-full"
          variant="outline"
        >
          Update <Pencil className="w-4 h-4" />
        </Button>
      </form>
    </Form>
  );
}
