"use client";

import { ContactAuthProvider } from "self-iam";
import "self-iam/styles.css";

export function SelfIAMProvider({ children }: { children: React.ReactNode }) {
  return (
    <ContactAuthProvider
      apiUrl={process.env.NEXT_PUBLIC_SELFIAM_API_URL ?? "https://selfiam.site"}
      publishableKey={process.env.NEXT_PUBLIC_SELFIAM_PUBLISHABLE_KEY ?? ""}
    >
      {children}
    </ContactAuthProvider>
  );
}
