import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Developer Portfolio",
  description:
    "Read my latest thoughts on web development, technology, and programming.",
  openGraph: {
    title: "Blog | Developer Portfolio",
    description:
      "Read my latest thoughts on web development, technology, and programming.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Developer Portfolio",
    description:
      "Read my latest thoughts on web development, technology, and programming.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

