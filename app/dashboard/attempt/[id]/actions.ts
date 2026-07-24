"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function submitExamAction(examId: string, studentAnswers: Record<number, string>) {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value;

  // 1. Authenticate based on YOUR custom cookie, not Supabase Auth
  if (!studentId) {
    return { error: "Session expired. Please log in again." };
  }

  // 2. Initialize Supabase directly with the Service Role
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3. Fetch the correct answers from the database securely
  const { data: questions } = await supabase
    .from("exam_questions")
    .select("id, correct_option")
    .eq("exam_id", examId);

  if (!questions || questions.length === 0) {
    return { error: "Could not retrieve exam data for grading." };
  }

  // 4. Grade the Exam (+4 for correct, -1 for wrong)
  let score = 0;
  const POSITIVE_MARKS = 4;
  const NEGATIVE_MARKS = 1;

  questions.forEach((q) => {
    const studentAns = studentAnswers[q.id];
    if (studentAns) {
      if (studentAns === q.correct_option) {
        score += POSITIVE_MARKS;
      } else {
        score -= NEGATIVE_MARKS;
      }
    }
  });

  // 5. Fetch Exam Meta to calculate Total Marks
  const { data: examData } = await supabase
    .from("exams")
    .select("title, total_marks")
    .eq("id", examId)
    .single();

  // 6. Save the Score to the database
  const { error: insertError } = await supabase.from("test_scores").insert({
    student_id: studentId,
    test_name: examData?.title || "Online Examination",
    score: score,
    total_marks: examData?.total_marks || (questions.length * POSITIVE_MARKS),
    test_date: new Date().toISOString()
  });

  if (insertError) {
    console.error("Database Insert Error:", insertError);
    return { error: "Failed to save exam results." };
  }

  // 7. Refresh the dashboard so the new score appears
  revalidatePath("/dashboard");
  return { success: true, score };
}