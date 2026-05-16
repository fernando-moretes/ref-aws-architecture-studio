import type { Metadata } from "next";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "AWS Architecture Studio — Fernando Azevedo",
  description:
    "Interactive studio to generate ADRs, build AWS architecture diagrams, browse reference patterns and explore the AWS service catalog.",
  authors: [{ name: "Fernando Francisco Azevedo", url: "https://fernando.moretes.com" }],
  openGraph: {
    title: "AWS Architecture Studio",
    description: "Generate ADRs, build AWS diagrams, explore patterns.",
    url: "https://studio.moretes.com",
    siteName: "AWS Architecture Studio",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
