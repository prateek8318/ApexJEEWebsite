export default function Header() {
  return (
    <>
      <section className="bg-[#07142D] rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-extrabold mb-4">Revision Notes</h1>
        <p className="text-lg mb-6">Your one‑stop resource for theory and formula sheets.</p>
        <div className="flex space-x-8">
          <div>
            <span className="block text-2xl font-bold">2</span>
            <span className="text-sm">Categories</span>
          </div>
          <div>
            <span className="block text-2xl font-bold">12</span>
            <span className="text-sm">Chapters</span>
          </div>
          <div>
            <span className="block text-2xl font-bold">12 MB</span>
            <span className="text-sm">Total Size</span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl p-5">
        {/* Physics Mathematics Tabs */}
      </section>
    </>
  );
}