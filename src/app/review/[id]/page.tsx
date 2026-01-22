import MainTemplates from "@/templates/MainTemplates";

export default async function ReviewUpdate({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <MainTemplates></MainTemplates>;
}
