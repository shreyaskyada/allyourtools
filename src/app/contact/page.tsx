import { Metadata } from "next";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Contact Us - AllYourTools",
  description: "Contact AllYourTools",
};

export default function Contact() {
  return (
    <Container className="py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-6">
        <p>
          Have a question, suggestion, or found a bug? We'd love to hear from you.
        </p>
        
        <section className="bg-muted/50 p-6 rounded-lg mt-8 border border-border">
          <h2 className="text-2xl font-semibold mb-4 mt-0">Get in Touch</h2>
          <p className="mb-0">
            For all inquiries, please email us directly at:
          </p>
          <p className="text-xl font-medium mt-2">
            <a href="mailto:hello@allyourtools.app" className="text-primary hover:underline">
              hello@allyourtools.app
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Feature Requests</h2>
          <p>
            If there's a specific tool you'd like to see added to our collection, let us know! We are constantly expanding our suite of utilities based on user feedback.
          </p>
        </section>
      </div>
    </Container>
  );
}
