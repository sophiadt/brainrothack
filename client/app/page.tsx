import Hero from "@/components/Hero";
import App from "../components/App";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <h1>Rizz Your Alpha</h1>
        <Hero />
        <Link href="/call">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Call
          </button>
        </Link>
        <App />
      </div>
    </main>
  );
}
