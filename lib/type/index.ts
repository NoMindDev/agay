export type MemberWithPermission = {
  id: string; // permission.id (uuid)
  created_at: string; // permission.created_at (timestamp)
  role: "ADMIN" | "USER"; // permission.role (enum)
  status: "ACTIVE" | "RESIGNED"; // permission.status (enum)
  member_id: string; // permission.member_id (uuid)
  member: {
    id: string; // member.id (uuid)
    created_at: string; // member.created_at (timestamp)
    name: string; // member.name (text)
    email: string;
  };
};
