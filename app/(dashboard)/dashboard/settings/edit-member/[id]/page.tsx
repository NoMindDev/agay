"use client";

import EditForm from "@/components/dashboard/member/EditorForm";
import { use } from "react";

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const unwrappedParams = use(params); // Unwrap the Promise to access `id`
  const { id } = unwrappedParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10">
        <EditForm memberId={id} />
      </div>
    </div>
  );
};

export default page;
