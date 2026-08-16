import FacultySchedule from "@/components/faculty/faculty-schedule";

export const dynamic =
  "force-dynamic";

export default function FacultySchedulePage() {
  const initialDate =
    new Date()
      .toISOString()
      .slice(0, 10);

  return (
    <FacultySchedule
      initialDate={
        initialDate
      }
    />
  );
}
