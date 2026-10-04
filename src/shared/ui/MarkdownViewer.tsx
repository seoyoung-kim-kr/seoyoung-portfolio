import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export default function MarkdownViewer({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="prose prose-sm prose-slate dark:prose-invert max-w-none break-keep prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-brand-dark dark:prose-headings:text-brand-light prose-h1:text-lg sm:prose-h1:text-xl prose-h1:mb-4 prose-h2:text-base sm:prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3 prose-h2:border-b prose-h2:border-brand-muted/30 prose-h2:pb-2 prose-h3:text-sm sm:prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2 prose-p:leading-relaxed prose-p:text-[14px] prose-p:my-2 prose-td:text-[14px] prose-th:text-[14px] [&_th]:whitespace-nowrap [&_td:first-child]:whitespace-nowrap [&_td:first-child]:font-semibold prose-li:text-[14px] prose-a:text-brand-accent dark:prose-a:text-brand-muted prose-a:no-underline hover:prose-a:underline prose-brand-muted prose-blockquote:border-l-4 prose-blockquote:border-brand-muted prose-blockquote:bg-brand-muted/10 dark:prose-blockquote:bg-brand-muted/15 prose-blockquote:py-2.5 prose-blockquote:px-4 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:my-4 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-hr:border-brand-muted/30 prose-hr:my-6 prose-img:rounded-3xl prose-img:shadow-xl prose-code:text-brand-dark dark:prose-code:text-brand-light prose-code:bg-brand-muted/30 dark:prose-code:bg-brand-muted/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (match) {
              const language = match[1];
              return (
                <div className="my-6 rounded-2xl overflow-hidden border border-brand-muted/30 bg-brand-dark-card shadow-2xl">
                  {/* macOS Terminal Window Controls Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#263125] border-b border-brand-muted/20 text-xs text-brand-muted">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-brand-pink inline-block" />
                      <span className="w-3 h-3 rounded-full bg-brand-muted inline-block" />
                      <span className="w-3 h-3 rounded-full bg-brand-muted-alt inline-block" />
                    </div>
                    <span className="font-mono text-[11px] text-brand-muted uppercase tracking-wider">
                      {language}
                    </span>
                  </div>
                  <div className="p-4 overflow-x-auto text-sm">
                    <SyntaxHighlighter
                      style={oneDark}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        padding: 0,
                        background: "transparent",
                        fontSize: "0.9rem",
                        lineHeight: "1.6",
                      }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
