import { onBoardUser } from "@/modules/auth/actions";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  await onBoardUser();
  return (
    <main className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* <Navbar /> */}

      <div className="min-h-screen w-full bg-[#020617] relative">
        {/* Cyan Radial Glow Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(6,182,212,0.4), transparent)`,
          }}
        />
        <div className="flex-1 w-full mt-20">{children}</div>
      </div>
    </main>
  );
};

export default layout;
