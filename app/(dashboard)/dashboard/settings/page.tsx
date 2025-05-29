"use client";

import { useEffect, useState, useTransition } from "react";
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
import { deleteMemberById, readMembers } from "@/app/actions";
import { MemberWithPermission } from "@/lib/type";

export default function SettingsPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [isPending, startTransiton] = useTransition();
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [members, setMembers] = useState<MemberWithPermission[] | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

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

    const fetchMembers = async () => {
      const { data: members, error } = await readMembers();
      if (error) {
        console.error("Failed to fetch members");
      } else {
        setMembers(members);
      }
    };

    fetchSession();
    fetchMembers();
  }, []);

  const isAdmin = user?.user_metadata?.role === "ADMIN";

  const handleDeleteMember = (memberId: string) => {
    setMemberToDelete(memberId);
    console.log("Deleting member with ID:", memberId);
    setIsDeleteDialogOpen(true);
  };

  const handleEditMember = (memberId: string) => {
    router.push(`/dashboard/settings/edit-member/${memberId}`);
  };

  const confirmDelete = async () => {
    if (!members || memberToDelete === null) return;

    startTransiton(async () => {
      const result = JSON.parse(await deleteMemberById(memberToDelete));
      if (result.error.message) {
        alert(result.error.message);
      } else {
        const updatedMembers = members.filter((m) => {
          console.log(m.id != memberToDelete);
          return m.id != memberToDelete;
        });
        setMembers(updatedMembers);
        setIsDeleteDialogOpen(false);
        setMemberToDelete(null);
        alert("Member deleted successfully.");
      }
    });
  };

  const toggleSort = (key: string) => {
    if (!members) return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedMembers = [...members].sort((a, b) => {
      let aVal: string | Date = "";
      let bVal: string | Date = "";

      if (key === "name") {
        aVal = a.member.name;
        bVal = b.member.name;
      } else if (key === "email") {
        aVal = a.member.email;
        bVal = b.member.email;
      } else if (key === "createdAt") {
        aVal = new Date(a.member.created_at);
        bVal = new Date(b.member.created_at);
      }

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setMembers(sortedMembers);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const renderHeader = (label: string, key: string) => (
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
                {renderHeader("Name", "name")}
                {renderHeader("Email", "email")}
                {renderHeader("Created At", "createdAt")}
                {isAdmin && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="text-black">
                    {member.member.name}
                  </TableCell>
                  <TableCell className="text-black">
                    {member.member.email}
                  </TableCell>
                  <TableCell className="text-black">
                    {formatDate(member.member.created_at)}
                  </TableCell>
                  {isAdmin && (
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
                  )}
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
