import Hero from "@/components/Hero";
import App from "../components/App";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative bg-[#18181B] flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5 min-h-screen">
      <div className="max-w-7xl w-full">
        {/* Outer container with flex layout for the three rectangles */}
        <div className="flex justify-center items-center space-x-4">
          {/* Left GIF container with top padding */}
          <div className="flex-1 pt-8">
            <img
              src="/assets/subway-surfer.gif"
              alt="Subway Surfer GIF"
              className="w-[271px] h-[455px] rounded-lg"
            />
          </div>

          {/* Main text and image container with flex layout */}
          <div
            className="rounded-lg p-6 mb-6 w-full max-w-2xl"
            style={{
              height: "400px",
              background: "linear-gradient(to right, #25262A, #43454C, #7F8290)",
            }}
          >
            <div className="flex justify-between items-center">
              {/* Text Box Section */}
              <div className="flex flex-col w-full pr-4">
                <h1 className="text-white font-bold text-3xl">
                  <span className="bg-gradient-to-r from-[#7D36E5] to-[#BE4DFD] bg-clip-text text-transparent">
                    Rizz Up
                  </span>{" "}
                  the Skibidiest
                  <br /> of Them All.
                </h1>
                <p className="text-white font-regular text-sm">
                  Think you can rizz up the internet’s icons? Glaze the nonchalant legends to gain
                  <span className="text-[#BE4DFD]"> +1000 aura</span> and unlock more NPCs.
                  Rizz up everyone to beat the Rizz o’meter and claim the crown of the
                  <span className="text-[#BE4DFD]"> Rizzlr</span>. Hawk tuah!
                </p>

                {/* Call to Action Button */}
                <Link href="/call">
                  <button className="bg-[#BE4DFD] hover:bg-[#CC72FF] text-white font-bold py-2 px-6 rounded-full mt-4">
                    Call
                  </button>
                </Link>
              </div>

              {/* Giga Chad Image */}
              <div className="ml-auto" style={{ width: "600px", height: "350px" }}>
                <img
                  src="/assets/giga-chad-hero.png"
                  alt="Giga Chad Hero"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right GIF container with top padding */}
          <div className="flex-1 pt-8">
            <img
              src="/assets/minecraft-parkour.gif"
              alt="Right GIF"
              className="w-[271px] h-[455px] rounded-lg"
            />
          </div>
        </div>

        {/* Overall Rizz Score Progress Bar */}
        <div className="mt-10 text-center">
          <h2 className="text-white text-lg font-bold mb-4">Overall Rizz Score</h2>
          <div className="relative w-full max-w-5xl mx-auto">
            {/* Progress Bar */}
            <div className="h-8 bg-[#3B3D43] rounded-full relative">
              <div className="h-full bg-gradient-to-r from-[#7D36E5] to-[#BE4DFD] rounded-full w-[40%]"></div>
            </div>

            {/* Milestone Images */}
            <div className="absolute inset-0 flex justify-between items-center -top-4">
              <img
                src="/assets/gooner.png"
                alt="Gooner"
                className="w-16 h-11 rounded-full transform translate-y-[2px]"  // Even higher
              />
              <img
                src="/assets/omega.png"
                alt="Omega"
                className="w-11 h-11 rounded-full transform translate-y-[2px]"  // Even higher
              />
              <img
                src="/assets/beta.png"
                alt="Beta"
                className="w-11 h-11 rounded-full transform translate-y-[2px]"  // Even higher
              />
              <img
                src="/assets/alpha.png"
                alt="Alpha"
                className="w-12 h-12 rounded-full transform translate-y-[2px]"  // Even higher
              />
              <img
                src="/assets/rizzlr.png"
                alt="Rizzlr"
                className="w-9 h-11 rounded-full transform translate-y-[2px]"  // Even higher
              />
            </div>


            {/* Milestone Labels */}
            <div className="flex justify-between mt-6">
              <span className="text-white text-regular font-poppins font-semibold text-center">Gooner</span>
              <span className="text-white text-regular font-poppins font-semibold text-center">Omega</span>
              <span className="text-white text-regular font-poppins font-semibold text-center">Beta</span>
              <span className="text-white text-regular font-poppins font-semibold text-center">Alpha</span>
              <span className="text-white text-regular font-poppins font-semibold text-center">RIZZLR</span>
            </div>
          </div>
        </div>


        <Hero />
        <App />
      </div>
    </main>
  );
}
