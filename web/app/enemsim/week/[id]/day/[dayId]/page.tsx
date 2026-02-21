import DayPageContent from "./DayPageContent";

export function generateStaticParams() {
    const weeks = Array.from({ length: 40 }, (_, i) => i + 1);
    const days = Array.from({ length: 11 }, (_, i) => i + 1); // 1-10 lessons, 11 simulado

    const params = [];
    for (const id of weeks) {
        for (const dayId of days) {
            params.push({ id: id.toString(), dayId: dayId.toString() });
        }
    }
    return params;
}

export default async function DayPage({ params }: { params: Promise<{ id: string; dayId: string }> }) {
    const { id, dayId } = await params;
    return <DayPageContent weekId={id} dayId={dayId} />;
}
