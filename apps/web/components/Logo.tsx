'use client';

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    className?: string;
}

export function Logo({ className = "" }: LogoProps) {
    return (
        <Link href="/">
            <Image width={200} height={200} className={className} src="/images/logo.png" alt="Logo" />
        </Link>
    );
}
