"use client";

import { AdminContestForm } from "@/components/admin/contest/AdminContestForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { adminContestService } from "@/services/admin-contest-service";

export default function AdminEditContestPage() {
    const params = useParams();
    const id = Number(params.id);

    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-contest', id],
        queryFn: () => adminContestService.getContest(id),
        enabled: !!id
    });

    const contest = data?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (error || !contest) {
         return (
            <div className="container mx-auto px-6 py-12 text-center">
                 <h1 className="text-3xl font-bold text-white mb-4">Error</h1>
                 <p className="text-red-500">Failed to load contest data.</p>
                 <Link href="/admin/contests-manage" className="mt-4 inline-block text-emerald-500 hover:underline">
                    Back to List
                 </Link>
            </div>
         );
    }

    return (
        <div className="container mx-auto px-6 py-12">
             <div className="mb-8 flex items-center gap-4">
                <Link href="/admin/contests-manage" className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Edit Contest</h1>
                    <p className="text-neutral-400">Editing: <span className="text-emerald-500">{contest.title}</span></p>
                </div>
            </div>
            
            <AdminContestForm initialData={contest} isEditing />
        </div>
    );
}
