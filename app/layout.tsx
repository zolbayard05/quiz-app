import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = { title: "Quiz app" };

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} min-h-screen`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
