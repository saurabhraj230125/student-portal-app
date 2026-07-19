"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Initialize Supabase with the Service Role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function loginStudent(formData: FormData) {
  // 🔥 THE FIX: .trim() removes invisible spaces from copy/pasting
  const username = (formData.get("username") as string)?.trim();
  const pin = (formData.get("pin") as string)?.trim();

  if (!username || !pin) {
    return { error: "Username and PIN are required." };
  }

  // Find the exact student
  const { data: student, error } = await supabase
    .from("students")
    .select("id, name, institute_id, batch")
    .eq("username", username)
    .eq("pin", pin)
    .single();

  // If there is an error, log it to the Vercel console so we can see what actually failed
  if (error) {
    console.error("Supabase Login Error:", error.message);
  }

  if (error || !student) {
    return { error: "Invalid username or PIN. Please check your details." };
  }

  // Lock them in with cookies
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