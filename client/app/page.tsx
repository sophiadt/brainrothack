import Hero from "@/components/Hero";
import Call from "../components/Call";
import Link from "next/link";
import Card from "@/components/Card";

export default function Home() {
  return (
    <main className="relative bg-[#18181B] flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5 min-h-screen">
      <div className="max-w-7xl w-full">
        <div className="flex justify-center items-center space-x-4">
          <div className="flex-1 pt-8">
            <img
              src="/assets/subway-surfer.gif"
              alt="Subway Surfer GIF"
              className="w-[271px] h-[455px] rounded-lg"
            />
          </div>

          <div
            className="relative rounded-lg p-6 mb-6 w-full max-w-2xl"
            style={{
              height: "400px",
              background: "linear-gradient(to right, #25262A, #43454C, #7F8290)",
            }}
          >
            <div className="flex justify-between items-center">
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

                <Link href="/call">
                  <button className="bg-[#BE4DFD] hover:bg-[#CC72FF] text-white font-bold py-2 px-6 rounded-full mt-4">
                    Call
                  </button>
                </Link>
              </div>

              <div className="absolute bottom-0 right-0">
                <img
                  src="/assets/giga-chad-hero.png"
                  alt="Giga Chad Hero"
                  className="w-[15em] h-[15em] object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 pt-8">
            <img
              src="/assets/minecraft-parkour.gif"
              alt="Right GIF"
              className="w-[271px] h-[455px] rounded-lg"
            />
          </div>
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-white font-semibold text-2xl mb-5">Overall Rizz Score</h2>
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="h-8 bg-[#3B3D43] rounded-full relative">
              <div className="h-full bg-gradient-to-r from-[#7D36E5] to-[#BE4DFD] rounded-full w-[52%]"></div>
            </div>

            <div className="absolute inset-0 flex justify-between items-center -top-4">
              <img
                src="/assets/gooner.png"
                alt="Gooner"
                className="w-16 h-11 rounded-full transform translate-y-[2px]"
              />
              <img
                src="/assets/omega.png"
                alt="Omega"
                className="w-11 h-11 rounded-full transform translate-y-[2px]"
              />
              <img
                src="/assets/beta.png"
                alt="Beta"
                className="w-11 h-11 rounded-full transform translate-y-[2px]"
              />
              <img
                src="/assets/alpha.png"
                alt="Alpha"
                className="w-13 h-12 rounded-full transform translate-y-[2px]"
              />
              <img
                src="/assets/rizzlr.png"
                alt="Rizzlr"
                className="w-9 h-11 rounded-full transform translate-y-[2px]"
              />
            </div>

            <div className="flex justify-between mt-6">
              <span className="text-white text-regular font-poppins font-semibold text-center">Gooner</span>
              <span className="text-white text-regular font-poppins font-semibold text-center">Omega</span>
              <span className="text-white text-regular font-poppins font-semibold text-center">Beta</span>
              <span className="text-white text-regular font-poppins font-semibold text-center">Alpha</span>
              <span className="text-white text-regular font-poppins font-semibold text-center">RIZZLR</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <div className="flex flex-col items-center">
            <img
              src="/assets/chad-mewing.gif"
              alt="Chad Mewing"
              className="w-[200px] h-[250px] rounded-lg mb-4"
            />
            <img
              src="/assets/barron-trump.gif"
              alt="Barron Trump"
              className="w-[200px] h-[200px] rounded-lg"
            />
            <img
              src="/assets/alpha-wolf.gif"
              alt="alpha"
              className="w-[200px] h-[400px] rounded-lg"
            />
          </div>
          <div className="flex flex-col mx-4">
            <div className="flex justify-center">
              <Card
                imageSrc="/assets/giga-chad.jpg"
                title="Giga Chad"
                description="Giga Chad reeks of peak masculinity — rizzing him up is nearly impossible."
                tags={['Confident', 'Sigma', 'Alpha']}
              />
              <Card
                imageSrc="/assets/chill-guy.jpg"
                title="Chill Guy"
                description="His whole deal is that he’s a chill guy that lowkey doesn’t gaf."
                tags={['Chill', 'Nonchalant', 'DGAF']}
                disabled
              />
              <Card
                imageSrc="/assets/don-pollo.jpg"
                title="Don Pollo"
                description="Linganguli guli guli wacha lingangu lingangu linganguli guli wacha."
                tags={['Linganguli', 'GuliGuli', 'Guli']}
                disabled
              />
            </div>
            <div className="flex justify-center mt-4">
              <Card
                imageSrc="/assets/ksi.jpg"
                title="KSI"
                description="He already has too much negative aura, please save him."
                tags={['Screen', 'Ring', 'Pen', 'King']}
                disabled
              />
              <Card
                imageSrc="/assets/freakbob.jpg"
                title="Freakbob"
                description="Who can match each others freak first? Pick up Freakbob’s call!!!"
                tags={['Freaky', 'Bold', 'Zero Shame']}
                disabled
              />
              <Card
                imageSrc="/assets/granola-bar.jpg"
                title="Granola Bar"
                description="It easily crumbles on its own. Come with an ashtray and rizz it up. EZ W."
                tags={['Crumbly ASF', 'Contains Nuts']}
                disabled
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/assets/don-pollo.gif"
              alt="Don Pollo"
              className="w-[200px] h-[200px] rounded-lg mb-4"
            />
            <img
              src="/assets/joker-sigma.gif"
              alt="Joker Sigma"
              className="w-[200px] h-[290px] rounded-lg"
            />
            <img
              src="/assets/amogus.gif"
              alt="sussy baka"
              className="w-[200px] h-[400px] rounded-lg"
            />
          </div>
        </div>

        <Hero />
        <Call />
      </div>
    </main>
  );
}
