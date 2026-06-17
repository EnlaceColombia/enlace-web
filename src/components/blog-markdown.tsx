import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

type BlogMarkdownProps = {
  content: string;
  className?: string;
};

export function BlogMarkdown({ content, className }: BlogMarkdownProps) {
  if (!content.trim()) return null;

  return (
    <div
      className={cn(
        "blog-markdown space-y-4 text-foreground leading-relaxed",
        "[&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground",
        "[&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground",
        "[&_p]:text-base [&_p]:text-foreground/90",
        "[&_strong]:font-bold [&_strong]:text-foreground",
        "[&_em]:italic",
        "[&_a]:font-semibold [&_a]:text-violet [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-violet-soft",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2",
        "[&_li]:text-foreground/90",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-violet [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
        "[&_hr]:border-border [&_hr]:my-8",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
