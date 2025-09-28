/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) router.replace("/auth/login");
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return <div>Loading...</div>;
    return <>{ children } </>;
}
