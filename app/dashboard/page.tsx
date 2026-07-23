import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { logoutStudent } from "../actions"; 
import StudentPortalUI from "./StudentPortalUI";

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const cookieStore = await cookies(); 
  
  const studentId = cookieStore.get("student_id")?.value;
  const batchName = cookieStore.get("student_batch")?.value || "General Batch";
  const instituteId = cookieStore.get("institute_id")?.value;

  if (!studentId || !instituteId) {
    redirect("/");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: student } = await supabase
    .from("students")
    .select("name, full_name")
    .eq("id", studentId)
    .single();

  const studentName = student?.name || student?.full_name || "Student";

  const { data: folders } = await supabase
    .from("study_folders")
    .select("*")
    .eq("institute_id", instituteId)
    .order("created_at", { ascending: true });

  const { data: materials } = await supabase
    .from("study_materials")
    .select("*")
    .eq("institute_id", instituteId)
    .order("created_at", { ascending: false });

  // 🔥 CRITICAL FIX: The query matching the new "All Batches" string
  const { data: exams } = await supabase
    .from("exams")
    .select("id, title, duration_minutes, exam_type, created_at, total_marks")
    .eq("institute_id", instituteId)
    .eq("is_published", true)
    .in("batch_target", [batchName, "All Batches"]) 
    .order("created_at", { ascending: false });

  const { data: scores } = await supabase
    .from("test_scores")
    .select("*")
    .eq("student_id", studentId)
    .order("test_date", { ascending: false });

  return (
    <StudentPortalUI 
      studentName={studentName}
      batchName={batchName}
      folders={folders || []}
      materials={materials || []}
      exams={exams || []}
      scores={scores || []}
      logoutAction={logoutStudent}
    />
  );
}