// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { Pencil } from "lucide-react";
// import { MemberWithPermission } from "@/lib/type";
// import { useTransition } from "react";
// import { updateMemberAccountById } from "@/app/actions";

// const FormSchema = z
//   .object({
//     email: z.string().email(),
//     password: z.string().optional(),
//     confirm: z.string().optional(),
//   })
//   .refine((data) => data.confirm === data.password, {
//     message: "Passowrd doesn't match",
//     path: ["confirm"],
//   });

// export default function AccountForm({
//   memberData,
// }: {
//   memberData: MemberWithPermission | null;
// }) {
//   const [isPending, startTransition] = useTransition();

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       email: memberData?.member?.email || "",
//       password: "",
//       confirm: "",
//     },
//   });

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     if (!memberData?.member?.id) {
//       console.log("Member ID is not available");
//       return;
//     }

//     startTransition(async () => {
//       const { error } = JSON.parse(
//         await updateMemberAccountById(memberData.member.id, {
//           password: data.password,
//           email: data.email,
//         })
//       );

//       if (error || error?.messsage) {
//         alert("Error updating member: " + error.message);
//         console.error("Error updating member:", error.message);
//       } else {
//         console.log("Member updated successfully:", data);
//       }
//     });
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="email@gmail.com"
//                   type="email"
//                   {...field}
//                   onChange={field.onChange}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="******"
//                   type="password"
//                   onChange={field.onChange}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="confirm"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Confirm Password</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="******"
//                   type="password"
//                   onChange={field.onChange}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button
//           type="submit"
//           className="flex gap-2 items-center w-full"
//           variant="outline"
//         >
//           {isPending ? (
//             "Loading..."
//           ) : (
//             <>
//               Update
//               <Pencil className="w-4 h-4" />
//             </>
//           )}
//         </Button>
//       </form>
//     </Form>
//   );
// }

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
import { toast } from "sonner";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { MemberWithPermission } from "@/lib/type";
import { useState, useTransition } from "react";
import { updateMemberAccountById } from "@/app/actions";

const FormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().optional(),
    confirm: z.string().optional(),
  })
  .refine((data) => data.confirm === data.password, {
    message: "Password doesn't match",
    path: ["confirm"],
  });

export default function AccountForm({
  memberData,
}: {
  memberData: MemberWithPermission | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: memberData?.member?.email || "",
      password: "",
      confirm: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!memberData?.member?.id) {
      console.log("Member ID is not available");
      return;
    }

    startTransition(async () => {
      const { error } = JSON.parse(
        await updateMemberAccountById(memberData.member.id, {
          password: data.password,
          email: data.email,
        })
      );

      if (error || error?.message) {
        alert("Error updating member: " + error.message);
        console.error("Error updating member:", error.message);
      } else {
        toast.success("Member updated successfully");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@gmail.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="******"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
          {isPending ? (
            "Loading..."
          ) : (
            <>
              Update
              <Pencil className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
