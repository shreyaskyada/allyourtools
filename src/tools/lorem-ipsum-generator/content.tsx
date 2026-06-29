import React from "react";

export default function LoremIpsumContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Lorem Ipsum Generator</strong> is a quick and highly customizable tool for designers, developers, and writers to generate placeholder text for their projects.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Why use placeholder text?</h4>
      <p>
        When designing a website, brochure, or user interface, it's crucial to see how text will look before the actual copy is written. Using real text can distract clients and stakeholders from evaluating the visual layout. Lorem Ipsum provides a natural-looking block of text that mimics the flow of standard English without the distraction of meaningful content.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Customization</h4>
      <p>
        You can tailor the output to exactly fit your needs. Choose whether you need paragraphs, individual sentences, or just a specific number of words. The text is generated instantly in your browser, meaning it's fast and requires no internet connection after loading.
      </p>
    </div>
  );
}
