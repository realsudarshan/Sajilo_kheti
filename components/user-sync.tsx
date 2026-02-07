"use client";

import { useCreateUser } from "@/queryandmutation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export function UserSync() {
    const { user, isLoaded, isSignedIn } = useUser();
    const { mutate } = useCreateUser();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (isLoaded && isSignedIn && user && !hasSynced.current) {
            mutate({ id: user.id });
            hasSynced.current = true;
        }
    }, [isLoaded, isSignedIn, user, mutate]);

    return null;
}
