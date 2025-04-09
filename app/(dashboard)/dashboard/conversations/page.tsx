import React from "react";

const Page = () => {
  return (
    <div className="flex h-full items-center justify-center text-center px-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No Chat Selected
        </h2>
        <p className="text-gray-600">
          Please select a conversation from the left to view chat history.
        </p>
      </div>
    </div>
  );
};

export default Page;
