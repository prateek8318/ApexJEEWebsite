import { chapters } from "@/data/chapters";

export default function ChaptersTable() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow">
      <table className="w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Chapter</th>
            <th className="px-4 py-2 text-left">Pages</th>
            <th className="px-4 py-2 text-left">Size (MB)</th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((chapter) => (
            <tr key={chapter.id} className="border-b">
              <td className="px-4 py-2">{chapter.title}</td>
              <td className="px-4 py-2">{chapter.pages}</td>
              <td className="px-4 py-2">{chapter.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}