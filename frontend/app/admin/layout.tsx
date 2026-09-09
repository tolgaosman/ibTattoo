import { Inter } from "next/font/google";
import "../globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata = {
  title: "Admin Paneli - ibTattoo",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-paper text-ink antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
