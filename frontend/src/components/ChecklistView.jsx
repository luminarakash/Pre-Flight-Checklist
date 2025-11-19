export default function ChecklistView({ checklist }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 small-muted">
        <div>Departure: {checklist.departureLocation} {checklist.departureTime && `• ${checklist.departureTime}`}</div>
        <div>Arrival: {checklist.arrivalLocation} {checklist.estArrivalTime && `• ${checklist.estArrivalTime}`}</div>
      </div>

      <div className="mt-3">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600">
              <th className="py-2">Check</th>
              <th className="py-2">Status</th>
              <th className="py-2">Comments</th>
            </tr>
          </thead>
          <tbody>
            {checklist.items && checklist.items.map((it, i) => (
              <tr key={i} className="border-t">
                <td className="py-2 align-top">{it.text}</td>
                <td className="py-2 align-top">
                  <span className={`px-2 py-1 rounded text-sm ${it.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {it.status}
                  </span>
                </td>
                <td className="py-2 align-top text-sm text-gray-700">{it.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
