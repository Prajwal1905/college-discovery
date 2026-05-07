export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Find Your Perfect College
      </h1>
      <p className="text-xl text-gray-500 mb-8 max-w-xl">
        Discover, explore and compare top colleges across India. Make the right decision for your future.
      </p>
      <div className="flex gap-4">
        <a href="/colleges" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
          Browse Colleges
        </a>
        <a href="/compare" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">
          Compare Colleges
        </a>
      </div>
    </div>
  )
}