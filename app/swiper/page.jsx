import React from "react";
import CardStack from "@/components/CardStack";

const SweiperPage = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#1a1a1a] relative">
        {/* Background blobs for the aesthetic */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-500/50 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/30 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

        <div className="z-10 w-full px-4">
          <CardStack />
        </div>
      </main>
    </>
  );
};

export default SweiperPage;
