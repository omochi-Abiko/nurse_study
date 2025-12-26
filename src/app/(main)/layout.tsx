import { TabBar } from "@/components/ui/tab-bar";
import { Providers } from "@/components/providers";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen pb-safe">
        {children}
        <TabBar />
      </div>
    </Providers>
  );
}
