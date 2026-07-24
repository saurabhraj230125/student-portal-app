"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function submitExamAction(examId: string, studentAnswers: Record<string, string>, tabSwitches: number) {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value;

  if (!studentId) return { error: "Session expired. Please log in again." };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: questions } = await supabase
    .from("exam_questions")
    .select("id, correct_option, marks, negative_marks")
    .eq("exam_id", examId);

  if (!questions || questions.length === 0) return { error: "Could not retrieve exam data." };

  let score = 0;
  questions.forEach((q) => {
    const studentAns = studentAnswers[q.id];
    if (studentAns) {
      if (studentAns === q.correct_option) score += (q.marks || 4);
      else score -= (q.negative_marks || 1);
    }
  });

  const { data: examData } = await supabase.from("exams").select("title, total_marks").eq("id", examId).single();

  const { error: insertError } = await supabase.from("test_scores").insert({
    student_id: studentId,
    test_name: examData?.title || "Online Examination",
    score: score,
    total_marks: examData?.total_marks || (questions.length * 4),
    tab_switches: tabSwitches || 0,
    test_date: new Date().toISOString()
  });

  if (insertError) return { error: "Failed to save exam results." };

  // 🔥 CRITICAL CACHE FIX: Refresh BOTH dashboards instantly!
  revalidatePath("/dashboard");          // Refresh Student view
  revalidatePath("/dashboard/exams");    // Refresh Owner Analytics view
  
  return { success: true };
}