"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Initialize Supabase (bypassing RLS for secure server actions)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function loginStudent(formData: FormData) {
  const username = formData.get("username") as string;
  const pin = formData.get("pin") as string;

  if (!username || !pin) {
    return { error: "Username and PIN are required." };
  }

  const { data: student, error } = await supabase
    .from("students")
    .select("id, name, institute_id, batch")
    .eq("username", username)
    .eq("pin", pin)
    .single();

  if (error || !student) {
    return { error: "Invalid username or PIN. Please check your details." };
  }

  // Set secure cookies so the dashboard knows who logged in
  const cookieStore = await cookies();
  cookieStore.set("student_id", student.id, { httpOnly: true, path: "/" });
  cookieStore.set("institute_id", student.institute_id, { httpOnly: true, path: "/" });
  cookieStore.set("student_batch", student.batch || "General", { httpOnly: true, path: "/" });

  redirect("/dashboard");
}

export async function logoutStudent() {
  const cookieStore = await cookies();
  cookieStore.delete("student_id");
  cookieStore.delete("institute_id");
  cookieStore.delete("student_batch");
  redirect("/");
}