import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            <h1>_Technology Roster: Course Admin</h1>
            <main>
                {children}
            </main>
        </>
    )
}