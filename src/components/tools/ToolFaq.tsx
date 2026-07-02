import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface ToolFaqProps {
  faqs: FaqItem[];
}

export default function ToolFaq({ faqs }: ToolFaqProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="border-t border-border pt-10">
      <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
        Frequently Asked Questions
      </h2>
      <Accordion className="w-full max-w-3xl">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-left font-medium text-base py-4 hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
