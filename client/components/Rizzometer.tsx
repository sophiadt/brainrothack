"use client";

import React from "react";

const Rizzometer = ({ score }: { score: number }) => {
  return (
    <div className="mt-10 text-center">
      <h2 className="text-white font-semibold text-2xl mb-5">Overall Rizz Score</h2>
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="h-8 bg-[#3B3D43] rounded-full relative">
          <div
            className="h-full bg-gradient-to-r from-[#7D36E5] to-[#BE4DFD] rounded-full"
            style={{ width: `${score}%` }} // Adjust bar width based on score
          ></div>
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
      </div>
    </div>
  );
};

export default Rizzometer;