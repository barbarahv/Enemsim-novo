import SubjectPageContent from "./SubjectPageContent";

export function generateStaticParams() {
    const modules = Array.from({ length: 10 }, (_, i) => i + 1);
    const subjects = Array.from({ length: 9 }, (_, i) => i + 1);

    const params = [];
    for (const id of modules) {
        for (const subjectId of subjects) {
            params.push({ id: id.toString(), subjectId: subjectId.toString() });
        }
    }
    return params;
}

export default async function ConcursoSubjectPage({ params }: { params: Promise<{ id: string; subjectId: string }> }) {
    const { id, subjectId } = await params;
    return <SubjectPageContent id={id} subjectId={subjectId} />;
}
