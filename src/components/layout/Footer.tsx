"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";
import Container from "@/components/layout/Container";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12 text-sm text-muted-foreground">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Wrench className="h-3 w-3" />
              </span>
              <span>AllYourTools</span>
            </Link>
            <p className="text-xs max-w-xs">
              A comprehensive suite of free, high-performance web utilities for
              developers, designers, and content creators. Built for maximum
              speed, privacy, and ease of use.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">
              Popular Tools
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link
                  href="/tools/json-formatter"
                  className="hover:text-foreground transition-colors"
                >
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/uuid-generator"
                  className="hover:text-foreground transition-colors"
                >
                  UUID Generator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Resources</h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Browse All
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="hover:text-foreground transition-colors"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Company & Legal</h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} AllYourTools. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1">
            Privacy First &bull; 100% Free &bull; Open Source
          </p>
        </div>
      </Container>
    </footer>
  );
}
