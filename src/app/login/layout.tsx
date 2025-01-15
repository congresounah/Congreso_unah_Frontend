import { ReactNode } from 'react';

import PreHomeLayout from "../layouts/preHomeLayout"

export default function Layout ({ children }: { children: ReactNode }) {
    return (
    <PreHomeLayout>
        {children}
    </PreHomeLayout>
    )
}