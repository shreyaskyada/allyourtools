import { Metadata } from "next";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Privacy Policy - AllYourTools",
  description: "Privacy Policy for AllYourTools",
};

export default function PrivacyPolicy() {
  return (
    <Container className="py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-6">
        <p><strong>Last Updated: July 23, 2026</strong></p>
        
        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to AllYourTools ("we," "our," or "us"). We respect your privacy and are committed to protecting it through our compliance with this privacy policy. 
            This policy describes the types of information we may collect from you or that you may provide when you visit the website (allyourtools.app) and our practices for collecting, using, maintaining, protecting, and disclosing that information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Client-Side Processing</h2>
          <p>
            The core functionality of AllYourTools operates entirely within your web browser (client-side). The text, files, and data you input into our tools are processed locally on your device and are <strong>never</strong> sent to our servers. We do not store, view, or analyze the data you process using our tools.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Third-Party Advertising (Google AdSense)</h2>
          <p>
            We use Google AdSense to display advertisements on our website. Google, as a third-party vendor, uses cookies to serve ads on our site.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</li>
            <li>Users may opt-out of personalized advertising by visiting <a href="https://myadcenter.google.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
            <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Usage Data and Analytics</h2>
          <p>
            We may collect non-personally identifiable information about your interaction with our website. This includes your IP address, browser type, operating system, and the pages you visit. This data is used solely to analyze website traffic, improve user experience, and monitor the technical performance of our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Consent</h2>
          <p>
            By using our website, you consent to our website's Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to Our Privacy Policy</h2>
          <p>
            If we decide to change our privacy policy, we will post those changes on this page.
          </p>
        </section>
      </div>
    </Container>
  );
}
