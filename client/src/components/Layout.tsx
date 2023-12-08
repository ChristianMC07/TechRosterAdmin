import { PropsWithChildren } from "react";

import { Arvo } from "next/font/google";
const arvo = Arvo({ weight: "400", subsets: ['latin'] });

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <h1 className={`mt-5 mb-10 text-5xl text-center text-blue-950 ${arvo.className}`}>_Technology Roster: Course Admin</h1>
            <main className={`${arvo.className}`}>
                {children}
            </main>
        </>
    )
}