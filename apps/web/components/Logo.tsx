'use client';

import Image from "next/image";

interface LogoProps {
    className?: string;
}

export function Logo({ className = "" }: LogoProps) {
    return (
        <Image width={200} height={200} className={className} src="/images/logo.png" alt="Logo" />
    );
}
