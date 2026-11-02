import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { themeInitScript } from "@/shared/theme/theme";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "گفتگو با فیوتریکس",
  description: "رابط گفتگوی استریمینگ با مدل زبانی فیوتریکس",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0f12" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7f4" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // `dark` is the server default; the inline script may remove it before paint.
    <html lang="fa" dir="rtl" className={`dark ${vazirmatn.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full font-sans">{children}</body>
    </html>
  );
}
