import type { Metadata } from "next";
import './globals.css'
import React from "react";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import ConditionalLayout from './components/ConditionalLayout';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Listo Shopping List",
  description: "This an application created for a University Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
