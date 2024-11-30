import Hero from "@/components/Hero";
import App from "../components/App";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative bg-[#18181B] flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5 min-h-screen">
      <div className="max-w-7xl w-full">
        <h1 className="text-white font-bold text-4xl">
          <span className="bg-gradient-to-r from-[#7D36E5] to-[#BE4DFD] bg-clip-text text-transparent">Rizz Up</span> the Skibidiest of Them All.
        </h1>
        <p className="text-white font-regular text-base">Think you can rizz up the internet’s icons? Glaze the nonchalant legends to gain +1000 aura and unlock more NPCs. Rizz up everyone to beat the Rizz o’meter and claim the crown of the Rizzlr. Hawk tuah!</p>
        <Link href="/call">
          <button className="bg-[#BE4DFD] hover:bg-[#CC72FF] text-white font-bold py-2 px-6 rounded-full mt-4">
            Call
          </button>
        </Link>
        <Hero />
        <App />
      </div>
    </main>
  );
}


