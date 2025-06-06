import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"


export const metadata: Metadata = {
  title: "Hire Hack ",
  description: "Hire Hack is a modern web application designed to streamline hiring processes and facilitate talent acquisition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
