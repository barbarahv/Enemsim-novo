import { redirect } from 'next/navigation';

export function generateStaticParams() {
    return Array.from({ length: 40 }, (_, i) => ({
        id: (i + 1).toString(),
    }));
}

export default function WeekRedirect({ params }: { params: Promise<{ id: string }> }) {
    redirect('/enemsim');
}
