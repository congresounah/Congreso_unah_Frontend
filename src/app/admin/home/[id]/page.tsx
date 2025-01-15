'use client';

import UserProfile from "@/components/UserProfile";
import { useSearchParams } from 'next/navigation';

export default function Page() {
    const searchParams = useSearchParams();
    const visualizar = searchParams.get('visualizar');
    const isVisualizing = visualizar === 'true';

    return (
        <UserProfile isVisualizing={isVisualizing} />
    );
}