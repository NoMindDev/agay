"use client";

import EditForm from "@/components/dashboard/member/EditorForm";
import { use, useEffect, useState } from "react";
import { MemberWithPermission } from "@/lib/type";
import { createClient } from "@/utils/supabase/client";

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const unwrappedParams = use(params); // Unwrap the Promise to access `id`
  const { id } = unwrappedParams;
  const supabase = createClient();
  const [memberData, setMemberData] = useState<MemberWithPermission | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("permission")
        .select("*, member(*)")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching member:", error);
      } else {
        setMemberData(data);
      }

      setLoading(false);
    };

    fetchMember();
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10">
        {loading ? (
          "Loading..."
        ) : (
          <EditForm memberId={id} memberData={memberData} />
        )}
      </div>
    </div>
  );
};

export default page;
