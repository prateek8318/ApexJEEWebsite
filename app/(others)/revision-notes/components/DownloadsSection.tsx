export default function DownloadsSection() {
  return (
    <section className="space-y-4 bg-white p-5 rounded-xl shadow">
      {/* Download Bar */}
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12v9m0 0l-3-3m3 3l3-3"/></svg>
          <span className="font-medium">Download All Notes</span>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Download</button>
      </div>

      {/* Search Bar */}
      <div className="flex">
        <input
          type="text"
          placeholder="Search notes..."
          className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-4 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r hover:bg-gray-300 transition">
          Search
        </button>
      </div>
    </section>
  );
}