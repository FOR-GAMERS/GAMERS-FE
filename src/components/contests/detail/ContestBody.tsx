import ContestCTA from "./ContestCTA";
import ReactMarkdown from "react-markdown";
import ContestNavigationLinks from "./ContestNavigationLinks";

interface ContestBodyProps {
  description: string;
  ctaProps: React.ComponentProps<typeof ContestCTA>;
  navigationProps?: React.ComponentProps<typeof ContestNavigationLinks>;
}

export default function ContestBody({ description, ctaProps, navigationProps }: ContestBodyProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
            <div className="prose prose-invert prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
                prose-h1:text-4xl prose-h1:border-b prose-h1:border-white/10 prose-h1:pb-4 prose-h1:mb-8
                prose-h2:text-2xl prose-h2:text-neon-cyan prose-h2:mt-10 prose-h2:mb-4
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-ul:my-6 prose-li:text-gray-300 prose-li:marker:text-neon-purple
                prose-strong:text-white prose-strong:font-black
                prose-a:text-neon-cyan hover:prose-a:text-cyan-300 prose-a:transition-colors
                prose-blockquote:border-l-4 prose-blockquote:border-neon-purple prose-blockquote:bg-white/5 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:italic
            ">
                <ReactMarkdown>{description}</ReactMarkdown>
            </div>
        </div>
        <div className="lg:w-[380px] flex-shrink-0">
            <ContestCTA {...ctaProps} />
            <div className="mt-4">
               {/* Navigation Links (Playground / Dashboard) */}
               {navigationProps && (
                  <ContestNavigationLinks 
                    contestId={navigationProps.contestId} 
                    userStatus={navigationProps.userStatus} 
                  />
               )}
            </div>
        </div>
      </div>
    </div>
  );
}
