import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import LiveExamUI from "./LiveExamUI";

export const dynamic = "force-dynamic";

// 🔥 CRITICAL FIX 1: Type 'params' explicitly as a Promise
export default async function ExamAttemptPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value;

  if (!studentId) redirect("/");

  // 🔥 CRITICAL FIX 2: You MUST await the params object before reading the ID
  const resolvedParams = await params;
  const examId = resolvedParams.id;

  // Use Service Role to guarantee we fetch the data, ignoring RLS blocks
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Fetch Exam Details
  const { data: exam, error: examError } = await supabase
    .from("exams")
    .select("*")
    .eq("id", examId)
    .single();

  // Security: If the exam doesn't exist or errors out, kick back to dashboard
  if (examError || !exam) {
    console.error("Exam Fetch Error:", examError);
    redirect("/dashboard"); 
  }

  // 2. Fetch Exam Questions (Excluding correct answers so students can't cheat via DevTools)
  const { data: questions, error: qError } = await supabase
    .from("exam_questions")
    .select("id, question_text, option_a, option_b, option_c, option_d, marks, negative_marks")
    .eq("exam_id", examId)
    .order("id", { ascending: true });

  if (qError) {
    console.error("Questions Fetch Error:", qError);
  }

  return (
    <LiveExamUI 
      exam={exam} 
      questions={questions || []} 
    />
  );
}