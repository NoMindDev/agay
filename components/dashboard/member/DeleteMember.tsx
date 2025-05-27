import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pencil, Trash } from "lucide-react";
import React from "react";

const DeleteMember = () => {
  //   const handleDeleteMember = (memberId: number) => {
  //     setMemberToDelete(memberId);
  //     setIsDeleteDialogOpen(true);
  //   };

  return (
    <DropdownMenuItem
      className="text-red-600 focus:text-red-600"
      //   onClick={() => handleDeleteMember(Number(member.id))}
    >
      <Trash className="mr-2 h-4 w-4" />
      Delete Member
    </DropdownMenuItem>
  );
};

export default DeleteMember;
