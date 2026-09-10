import { notFound } from "next/navigation";
import ProgramDetail from "@/components/programs/ProgramDetail";
import { programs } from "@/lib/program-data";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return programs.map((program) => ({
    slug: program.slug,
  }));
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;

  const program = programs.find(
    (item) => item.slug === slug
  );

  if (!program) {
    notFound();
  }

  return <ProgramDetail program={program} />;
}