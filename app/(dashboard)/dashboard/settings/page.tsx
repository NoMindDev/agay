"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Trash, ArrowUpDown, Pencil } from "lucide-react";
import { useUserStore } from "@/lib/store/user";
import { readUserSession } from "@/utils/supabase/client";

// Sample members data
const initialMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JD",
    createdAt: "2025-04-09T18:00:00Z",
    invitedAt: "2025-04-08T15:00:00Z",
  },
  {
    id: 2,
    name: "Sara",
    email: "sara@gmail.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "S",
    createdAt: "2025-04-09T02:00:00Z",
    invitedAt: "2025-04-08T15:00:00Z",
  },
  {
    id: 3,
    name: "Alice",
    email: "alice@gmail.com",
    avatar: "",
    initials: "A",
    createdAt: "2025-04-08T15:00:00Z",
    invitedAt: "2025-03-04T15:00:00Z",
  },
  {
    id: 4,
    name: "Bob",
    email: "bob@gmail.com",
    avatar: "",
    initials: "B",
    createdAt: "2025-03-04T15:00:00Z",
    invitedAt: "2025-03-04T15:00:00Z",
  },
  {
    id: 5,
    name: "Zabab",
    email: "zabab@gmail.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "Z",
    createdAt: "2025-02-01T15:00:00Z",
    invitedAt: "2025-02-01T15:00:00Z",
  },
];

export default function SettingsPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [members, setMembers] = useState(initialMembers);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof initialMembers)[0] | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  console.log("Inside the setting page");

  // User
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await readUserSession();
      if (!session) {
        router.push("/sign-in");
      } else {
        useUserStore.setState({ user: session.user });
      }
    };

    fetchSession();
  }, []);

  const isAdmin = user?.user_metadata?.role === "ADMIN";

  const handleDeleteMember = (memberId: number) => {
    setMemberToDelete(memberId);
    setIsDeleteDialogOpen(true);
  };

  const handleEditMember = (memberId: number) => {
    router.push(`/dashboard/settings/edit-member/${memberId}`);
  };

  const confirmDelete = () => {
    setMembers((prev) => prev.filter((m) => m.id !== memberToDelete));
    setIsDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const toggleSort = (key: keyof (typeof initialMembers)[0]) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    setMembers((prev) =>
      [...prev].sort((a, b) => {
        const aVal = key.includes("At") ? new Date(a[key] as string) : a[key];
        const bVal = key.includes("At") ? new Date(b[key] as string) : b[key];

        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const renderHeader = (
    label: string,
    key: keyof (typeof initialMembers)[0]
  ) => (
    <TableHead
      className="cursor-pointer select-none"
      onClick={() => toggleSort(key)}
    >
      {label}
      <ArrowUpDown className="inline-block ml-1 w-4 h-4" />
    </TableHead>
  );

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Organization Members</h1>
            <p className="text-gray-500 mt-1">
              Here lies the organization members that have currently joined your
              org.
            </p>
          </div>

          {isAdmin && (
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => router.push("/dashboard/settings/invite-agent")}
            >
              Add New Member
            </Button>
          )}
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                {renderHeader("Name", "name")}
                {renderHeader("Email", "email")}
                {renderHeader("Created At", "createdAt")}
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      {member.avatar ? (
                        <AvatarImage src={member.avatar} alt={member.name} />
                      ) : null}
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="text-black">{member.name}</TableCell>
                  <TableCell className="text-black">{member.email}</TableCell>
                  <TableCell className="text-black">
                    {formatDate(member.createdAt)}
                  </TableCell>
                  <TableCell className="text-black">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem
                          onClick={() => handleEditMember(member.id)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Update Member
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                agent and remove their data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
