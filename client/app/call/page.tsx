export default function CallPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Giga Chad Lv. 1</h1>
      <p className="text-lg">Listening...</p>
      <div className="mt-8 flex items-center space-x-6">
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full">
          Hang Up
        </button>
        <button className="bg-purple-500 hover:bg-purple-400 text-white px-6 py-3 rounded-full">
          See Analysis
        </button>
      </div>
    </div>
  );
}