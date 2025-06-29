"use client";

import { useAuth } from "../contexts/authContext"

export default function HomePage() {
    const { user } = useAuth();
    return (
        <>
            <h1>
                Hello {JSON.stringify(user?.email)}
            </h1>
        </>
    );
}