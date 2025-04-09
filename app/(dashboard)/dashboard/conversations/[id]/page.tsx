"use client";

import Image from "next/image";

const chatMessages = [
  {
    id: 1,
    sender: "bot",
    message: "Hello there what can I help you with",
    timestamp: new Date(),
    avatar: "/nlcs-logo.png",
  },
  {
    id: 2,
    sender: "user",
    message: "Ask me anything about your old documents",
    timestamp: new Date(),
  },
  {
    id: 3,
    sender: "bot",
    message: "Sure! Do you have any specific document in mind?",
    timestamp: new Date(),
    avatar: "/nlcs-logo.png",
  },
  {
    id: 4,
    sender: "user",
    message: "I have a file about my previous project proposal.",
    timestamp: new Date(),
  },
  {
    id: 5,
    sender: "bot",
    message:
      "Great! Could you please upload the file so I can assist you further?",
    timestamp: new Date(),
    avatar: "/nlcs-logo.png",
  },
  {
    id: 6,
    sender: "user",
    message: "Here is the file. I need help with reviewing the contents.",
    timestamp: new Date(),
  },
  {
    id: 7,
    sender: "bot",
    message: "I will analyze the file and provide feedback shortly.",
    timestamp: new Date(),
    avatar: "/nlcs-logo.png",
  },
  {
    id: 8,
    sender: "user",
    message: "Thank you! Let me know if you need more information.",
    timestamp: new Date(),
  },
  {
    id: 9,
    sender: "bot",
    message: "You're welcome! I'll be in touch once the review is complete.",
    timestamp: new Date(),
    avatar: "/nlcs-logo.png",
  },
  {
    id: 10,
    sender: "user",
    message: "I appreciate your help! Looking forward to the feedback.",
    timestamp: new Date(),
  },
  {
    id: 11,
    sender: "bot",
    message:
      "This is a very long message to test the scrolling functionality of the chat message area. Let's see if it works as expected when the content overflows the container. We will add more and more text to make sure the scrollbar appears and the header remains fixed at the top.",
    timestamp: new Date(),
    avatar: "/nlcs-logo.png",
  },
  {
    id: 12,
    sender: "user",
    message: "Okay, I understand. Let's see how it behaves with a lot of text.",
    timestamp: new Date(),
  },
  {
    id: 13,
    sender: "bot",
    message:
      "Adding even more text now to really push the limits of the scrolling container. We need to ensure that the user experience remains smooth even with extensive chat history.",
    timestamp: new Date(),
    avatar: "/nlcs-logo.png",
  },
  {
    id: 14,
    sender: "user",
    message:
      "Looks like it's working! The header is staying fixed and the messages are scrollable.",
    timestamp: new Date(),
  },
];

import { use } from "react";

export default function ChatViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params); // Unwrap the Promise to access `id`
  const { id } = unwrappedParams;

  return (
    <>
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-medium text-black">John Doe</h2>{" "}
        {/* Keep name here */}
        <Image
          src="/nlcs-logo.png"
          alt="User"
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Bot Avatar (left) */}
              {message.sender === "bot" && message.avatar && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={message.avatar}
                    alt="Bot"
                    width={32}
                    height={32}
                  />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[70%] rounded-lg p-3 text-sm ${
                  message.sender === "user"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-500 text-white"
                }`}
              >
                {message.message}
              </div>

              {/* User Avatar (right) */}
              {message.sender === "user" && message.avatar && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={message.avatar}
                    alt="User"
                    width={32}
                    height={32}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
