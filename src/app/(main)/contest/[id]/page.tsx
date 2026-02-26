import ContestDetailClient from '@/components/contest/ContestDetailClient';
import ContestDiscussion from '@/components/contest/ContestDiscussion';

export default async function ContestPlaygroundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-deep-black text-white selection:bg-neon-cyan selection:text-deep-black font-sans">
      <ContestDetailClient contestId={id} />

      <section className="border-t border-neutral-800 bg-neutral-900/20 mt-12">
        <div className="container mx-auto px-4 py-12">
             <ContestDiscussion contestId={parseInt(id)} />
        </div>
      </section>
    </div>
  );
}

