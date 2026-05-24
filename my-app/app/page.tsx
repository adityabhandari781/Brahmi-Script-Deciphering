import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero  />
          <Features />
        </div>

      
      
    </>
    
  );
}
