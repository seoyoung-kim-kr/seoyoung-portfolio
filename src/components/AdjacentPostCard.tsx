import { Post } from "../service/posts";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

type Props = {
  post: Post;
  type: "next" | "prev";
};

export default function AdjacentPostCard({
  post: { path, title, description },
  type,
}: Props) {
  const isPrev = type === "prev";

  return (
    <Link
      href={`/projects/${path}`}
      className="group flex-1 min-w-0 w-full flex items-center gap-4 p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-brand-dark-card/80 border border-brand-muted/40 dark:border-brand-muted/20 backdrop-blur-md hover:bg-white dark:hover:bg-brand-dark-card shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {isPrev && (
        <div className="w-10 h-10 rounded-full bg-brand-muted/30 dark:bg-brand-muted/20 flex items-center justify-center text-brand-dark dark:text-brand-light shrink-0 group-hover:-translate-x-1 transition-transform">
          <FiArrowLeft className="w-5 h-5" />
        </div>
      )}

      <div className={`flex-1 min-w-0 ${isPrev ? "text-left" : "text-right"}`}>
        <span className="text-xs font-bold text-brand-accent dark:text-brand-muted uppercase tracking-wider block mb-1">
          {isPrev ? "← Previous Post" : "Next Post →"}
        </span>
        <h3 className="text-sm sm:text-base font-bold text-brand-dark dark:text-brand-light truncate group-hover:text-brand-accent dark:group-hover:text-brand-muted transition-colors">
          {title}
        </h3>
      </div>

      {!isPrev && (
        <div className="w-10 h-10 rounded-full bg-brand-muted/30 dark:bg-brand-muted/20 flex items-center justify-center text-brand-dark dark:text-brand-light shrink-0 group-hover:translate-x-1 transition-transform">
          <FiArrowRight className="w-5 h-5" />
        </div>
      )}
    </Link>
  );
}
