"use client";

import { AdminContestForm } from "@/components/admin/contest/AdminContestForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminCreateContestPage() {
    return (
        <div className="container mx-auto px-6 py-12">
             <div className="mb-8 flex items-center gap-4">
                <Link href="/admin/contests-manage" className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Create Contest</h1>
                    <p className="text-neutral-400">Create a new contest configuration</p>
                </div>
            </div>
            
            <AdminContestForm />
        </div>
    );
}
