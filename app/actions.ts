"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function loginStudent(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const pin = (formData.get("pin") as string)?.trim();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: "CRITICAL: Database keys are missing from the environment." };
  }

  if (!username || !pin) {
    return { error: "Username and PIN are required." };
  }

  // 🔥 THE FIX: Using the exact column names from your Supabase table!
  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("portal_username", username)
    .eq("portal_pin", pin)
    .single();

  if (error) {
    console.error("Database Error:", error);
    // Keeping the X-Ray vision on just in case!
    return { error: `DATABASE ERROR: ${error.message}` };
  }

  if (!student) {
    return { error: "No student matched that exact Username and PIN." };
  }

  // Success! Set the cookies
  const cookieStore = await cookies();
  cookieStore.set("student_id", student.id, { httpOnly: true, path: "/" });
  cookieStore.set("institute_id", student.institute_id, { httpOnly: true, path: "/" });
  
  const finalBatch = student.batch || student.batch_name || "General";
  cookieStore.set("student_batch", finalBatch, { httpOnly: true, path: "/" });

  redirect("/dashboard");
}

export async function logoutStudent() {
  const cookieStore = await cookies();
  cookieStore.delete("student_id");
  cookieStore.delete("institute_id");
  cookieStore.delete("student_batch");
  redirect("/");
}