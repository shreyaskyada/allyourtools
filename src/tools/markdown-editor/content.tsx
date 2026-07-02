import React from "react";

export default function MarkdownEditorContent() {
  return (
    <div className="flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
      <section>
        <h2 className="text-xl font-bold text-foreground mb-2">What is the Online Markdown Editor?</h2>
        <p>
          The <strong>Online Markdown Editor & Previewer</strong> is a fast, powerful tool that lets you write Markdown syntax and instantly see how it will render as beautiful HTML. It's built for developers, writers, and content creators who need a distraction-free environment to draft READMEs, blog posts, and documentation.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">Key Features of the Previewer</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-foreground">Split-Screen Live Preview:</strong> See your formatting applied in real-time as you type, so you never have to guess what your final document will look like.
          </li>
          <li>
            <strong className="text-foreground">GitHub Flavored Markdown (GFM):</strong> Enjoy full support for tables, strikethrough, and task lists perfectly mimicking the GitHub rendering experience.
          </li>
          <li>
            <strong className="text-foreground">Export to HTML:</strong> With one click, export your raw markdown as a fully-styled, standalone HTML file ready to be shared or uploaded.
          </li>
          <li>
            <strong className="text-foreground">100% Client-Side Privacy:</strong> Your text never leaves your device. Everything is parsed and rendered entirely inside your browser.
          </li>
        </ul>
      </section>
    </div>
  );
}
