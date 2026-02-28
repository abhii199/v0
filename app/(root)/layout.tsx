import Navbar from "@/components/Navbar";
import { onBoardUser } from "@/modules/auth/actions";

const layout = async ({ children }: { children: React.ReactNode }) => {
  await onBoardUser();
  return (
    <main className="flex flex-col min-h-screen relative overflow-x-hidden">
      <div className="min-h-screen w-full bg-[#f8fafc] relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: "20px 30px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          }}
        />

        <Navbar />

        <div className="flex-1 w-full mt-20 relative">{children}</div>

      </div>
    </main>
  );
};

export default layout;
