import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
export async function POST(request: Request) {
  const supabase = await createClient();
  try {
    const {
      date,
      user_email,
      user_name,
      event,
      description,
      resource_name,
      resource_link,
    } = await request.json();
    if (
      //   !user_email ||
      //   !user_name ||
      !event ||
      !description ||
      !resource_name ||
      !resource_link
    ) {
      return NextResponse.json({ error: "Missing required fields" });
    }
    const { data, error } = await supabase
      .from("logs")
      .insert([
        {
          date: date || new Date().toISOString(),
          user_email,
          user_name,
          event,
          description,
          resource_name,
          resource_link,
        },
      ])
      .select();
    if (error) {
      return NextResponse.json({ error: error.message });
    }
    console.log(data);
    return NextResponse.json({ message: "success", data });
    // return NextResponse.json(); j6BzQGxhilz1qYPW
  } catch (err) {
    console.log(err, "error in getting files");
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("date", { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message });
    }
    console.log(data);
    return NextResponse.json({ message: "success", data });
  } catch (err) {
    console.log(err, "error in getting files");
  }
}
