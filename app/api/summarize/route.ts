// import { NextResponse } from "next/server";
// import { summarize } from "node-summary";

// export async function POST(req: Request) {
//   const body = await req.json();
//   const { conversation } = body;

//   return new Promise((resolve) => {
//     summarize("Conversation Summary", conversation, (err, summary) => {
//       if (err) {
//         console.error("Summary error:", err);
//         resolve(
//           NextResponse.json({ error: "Failed to summarize" }, { status: 500 })
//         );
//       } else {
//         resolve(NextResponse.json({ summary }));
//       }
//     });
//   });
// }
