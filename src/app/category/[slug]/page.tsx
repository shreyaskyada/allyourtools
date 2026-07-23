import { notFound } from "next/navigation";
import { categories } from "@/config/categories";
import { tools } from "@/config/tools";
import Container from "@/components/layout/Container";
import ToolCard from "@/components/tools/ToolCard";
import CategoryToolsGrid from "@/components/tools/CategoryToolsGrid";
import { Metadata } from "next";
import { Code, FileText, Palette, Calculator, Shield, Wrench, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.id === slug);
  if (!category) return {};

  return {
    title: `${category.name} Tools - AllYourTools`,
    description: category.description,
    alternates: {
      canonical: `https://allyourtools.app/category/${slug}`,
    },
  };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  FileText,
  Palette,
  Calculator,
  Shield,
  Wrench,
  Image: ImageIcon,
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.id === slug);

  if (!category) {
    notFound();
  }

  const categoryTools = tools.filter((t) => t.category === slug);
  const IconComponent = iconMap[category.icon] || Code;

  return (
    <Container className="py-10 flex-1">
      <div className="flex flex-col gap-10 w-full">


        {/* Hero Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <IconComponent className="h-8 w-8" />
            </span>
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                {category.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {/* Tools Grid with Search */}
        <CategoryToolsGrid tools={categoryTools} />
      </div>
    </Container>
  );
}
