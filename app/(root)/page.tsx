import PromptInputBox from "@/components/PromptInputBox";

export default function Page() {
  return (
    <div className="flex items-center justify-center w-full px-4 py-8">
      <div className="max-w-5xl w-full">
        <section className="space-y-8 flex flex-col items-center">
          <h1 className="text-2xl md:text-5xl font-bold text-center">Build Something with ❤️</h1>
          <p className="text-lg md:text-xl text-muted-foreground text-center">Create apps and websites simple prompting...</p>
          <div className="max-w-3xl w-full">
            {/* <PromptInputBox /> */}
          </div>
        </section>
      </div>


    </div>
  );
}
