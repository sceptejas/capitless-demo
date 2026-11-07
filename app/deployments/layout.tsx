import type { Metadata } from "next";
export const metadata: Metadata = { title: "Deployments — CAPITLESS" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
