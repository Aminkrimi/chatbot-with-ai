import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import type { Element } from "hast";
import { detectDirection } from "@/shared/lib/textDirection";
import { blockText } from "../../utils";
import { CodeBlock } from "./CodeBlock";

const dirOf = (node: Element | undefined) => detectDirection(blockText(node));

// Mixed Persian/English answers: each block gets its own direction from its prose (see detectDirection).
const components: Components = {
  pre: CodeBlock,
  p: ({ node, ...props }) => <p dir={dirOf(node)} {...props} />,
  ul: ({ node, ...props }) => <ul dir={dirOf(node)} {...props} />,
  ol: ({ node, ...props }) => <ol dir={dirOf(node)} {...props} />,
  li: ({ node, ...props }) => <li dir={dirOf(node)} {...props} />,
  h1: ({ node, ...props }) => <h1 dir={dirOf(node)} {...props} />,
  h2: ({ node, ...props }) => <h2 dir={dirOf(node)} {...props} />,
  h3: ({ node, ...props }) => <h3 dir={dirOf(node)} {...props} />,
  blockquote: ({ node, ...props }) => <blockquote dir={dirOf(node)} {...props} />,
  a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto">
      <table dir={dirOf(node)} {...props} />
    </div>
  ),
};

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeHighlight];

export const MarkdownContent = memo(function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-chat">
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
});
