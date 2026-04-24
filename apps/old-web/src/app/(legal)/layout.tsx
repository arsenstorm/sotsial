import { Footer } from "@/components/marketing/footer";

export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto max-w-3xl">
      {children}
      <Footer className="!px-0 mt-8" />
    </div>
  );
}
