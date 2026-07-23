import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { logoutStudent } from "../actions"; // Your existing logout action
import StudentPortalUI from "./StudentPortalUI";

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const cookieStore = await cookies(); 
  
  const studentId = cookieStore.get("student_id")?.value;
  const batchName = cookieStore.get("student_batch")?.value || "General Batch";
  const instituteId = cookieStore.get("institute_id")?.value;

  // Security barrier: Kick to login if no cookies exist
  if (!studentId || !instituteId) {
    redirect("/");
  }

  // Bypass RLS for secure, read-only student access using the service key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Fetch Student Details
  const { data: student } = await supabase
    .from("students")
    .select("name, full_name")
    .eq("id", studentId)
    .single();

  const studentName = student?.name || student?.full_name || "Student";

  // 2. Fetch Material Folders for this Institute
  const { data: folders } = await supabase
    .from("study_folders")
    .select("*")
    .eq("institute_id", instituteId)
    .order("created_at", { ascending: true });

  // 3. Fetch All Materials
  const { data: materials } = await supabase
    .from("study_materials")
    .select("*")
    .eq("institute_id", instituteId)
    .order("created_at", { ascending: false });

  // 4. Fetch Published Exams strictly for their Batch
  const { data: exams } = await supabase
    .from("exams")
    .select("id, title, duration_minutes, exam_type, created_at, total_marks")
    .eq("institute_id", instituteId)
    .eq("is_published", true)
    .in("batch_target", [batchName, "All Batches"]) 
    .order("created_at", { ascending: false });

  // 5. Fetch Past Scores
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