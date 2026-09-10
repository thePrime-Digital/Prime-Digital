import StudentClassDetails from "@/components/student/student-class-details";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { id } =
    await params;

  return (
    <StudentClassDetails
      classId={id}
    />
  );
}