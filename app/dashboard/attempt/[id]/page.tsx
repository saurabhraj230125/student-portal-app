import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import LiveExamUI from "./LiveExamUI";

export const dynamic = "force-dynamic";

export default async function ExamAttemptPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value;

  if (!studentId) redirect("/");

  // Use Service Role to bypass RLS securely for data fetching
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Fetch Exam Details
  const { data: exam } = await supabase
    .from("exams")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!exam) redirect("/dashboard");

  // 2. Fetch Exam Questions (Excluding correct answers for security)
  const { data: questions } = await supabase
    .from("exam_questions")
    .select("id, question_text, option_a, option_b, option_c, option_d")
    .eq("exam_id", params.id)
    .order("id", { ascending: true });

  return (
    <LiveExamUI 
      exam={exam} 
      questions={questions || []} 
    />
  );
}