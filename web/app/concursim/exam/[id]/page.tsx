import ExamPageContent from "./ExamPageContent";

export function generateStaticParams() {
    const modules = Array.from({ length: 10 }, (_, i) => i + 1);

    return modules.map((id) => ({
        id: id.toString(),
    }));
}

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ExamPageContent id={id} />;
}
