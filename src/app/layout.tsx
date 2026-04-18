import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { appConfig } from "@/lib/config/env";
import "./globals.css";

export const metadata: Metadata = {
  title: "Store",
  description: "E-commerce MVP"
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold text-gray-900">
              {appConfig.appName}
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-gray-700">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              <Link href="/produtos" className="hover:text-gray-900">
                Produtos
              </Link>
              <Link href="/carrinho" className="hover:text-gray-900">
                Carrinho
              </Link>
              <Link href="/checkout" className="hover:text-gray-900">
                Checkout
              </Link>
              <Link href="/admin" className="hover:text-gray-900">
                Admin
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
