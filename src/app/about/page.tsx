import { Metadata } from "next";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "About Us - AllYourTools",
  description: "About AllYourTools",
};

export default function About() {
  return (
    <Container className="py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About AllYourTools</h1>
      
      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-6">
        <p>
          AllYourTools was created with a simple mission: to provide a comprehensive, fast, and secure suite of everyday tools for developers, designers, and content creators—all in one place, completely free of charge.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Philosophy: Privacy First</h2>
          <p>
            We believe that your data is exactly that—yours. That's why the vast majority of our tools are built to run entirely in your browser (client-side). When you format JSON, generate a UUID, or encode text, your input never leaves your device. We don't see it, we don't save it, and we don't sell it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Why We Built This</h2>
          <p>
            As developers ourselves, we got tired of hunting for basic utilities across the web, dealing with clunky interfaces, intrusive pop-ups, and questionable privacy practices. We wanted a single, reliable toolkit that we could trust. So we built it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Supported By Ads</h2>
          <p>
            To keep AllYourTools 100% free for everyone, we display non-intrusive advertisements via Google AdSense. These ads help cover the costs of domain hosting and development time.
          </p>
        </section>
      </div>
    </Container>
  );
}
