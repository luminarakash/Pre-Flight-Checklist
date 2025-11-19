import React, { useEffect, useState } from "react";
import { updateChecklist } from "../services/api";

export default function EditChecklistModal({ open, checklist, onClose, onUpdated }) {
  // checklist: full object passed from parent
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (open && checklist) {
      // deep copy to avoid mutating parent state
      setForm(JSON.parse(JSON.stringify(checklist)));
      setNotice(null);
    }
  }, [open, checklist]);

  if (!open) return null;

  if (!form) return null;

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleItemChange = (idx, k, v) => {
    setForm(prev => {
      const items = [...(prev.items || [])];
      items[idx] = { ...items[idx], [k]: v };
      return { ...prev, items };
    });
  };

  const addItem = () => setForm(prev => ({ ...prev, items: [...(prev.items || []), { text: "", status: "Pending", comments: "" }] }));

  const removeItem = (i) => setForm(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.flightNumber || !form.date) {
      setNotice({ type: "error", text: "Flight Number and Date required." });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      const payload = { ...form };
      // ensure items array exists
      if (!Array.isArray(payload.items)) payload.items = [];
      const res = await updateChecklist(form._id, payload);
      setNotice({ type: "success", text: "Checklist updated." });
      onUpdated && onUpdated(res.data);
      // auto close small delay
      setTimeout(() => { onClose && onClose(); }, 700);
    } catch (err) {
      console.error(err);
      setNotice({ type: "error", text: err?.response?.data?.message || "Update failed." });
    } finally {
      setLoading(false);
    }
  };

  // Modal UI
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold">Edit Checklist — {form.flightNumber}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>

        {notice && (
          <div className={`mb-3 p-3 rounded ${notice.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {notice.text}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input" placeholder="Flight Number" value={form.flightNumber || ""} onChange={(e) => handleChange("flightNumber", e.target.value)} required />
            <input className="input" type="date" value={form.date ? new Date(form.date).toISOString().substr(0,10) : ""} onChange={(e) => handleChange("date", e.target.value)} required />
            <input className="input" placeholder="Filed By" value={form.filedBy || ""} onChange={(e) => handleChange("filedBy", e.target.value)} />
            <input className="input" placeholder="Filing Time" value={form.filingTime || ""} onChange={(e) => handleChange("filingTime", e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input" placeholder="Departure Location" value={form.departureLocation || ""} onChange={(e) => handleChange("departureLocation", e.target.value)} />
            <input className="input" placeholder="Departure Time" value={form.departureTime || ""} onChange={(e) => handleChange("departureTime", e.target.value)} />
            <input className="input" placeholder="Arrival Location" value={form.arrivalLocation || ""} onChange={(e) => handleChange("arrivalLocation", e.target.value)} />
            <input className="input" placeholder="Est Arrival Time" value={form.estArrivalTime || ""} onChange={(e) => handleChange("estArrivalTime", e.target.value)} />
          </div>

          <div>
            <h4 className="font-medium mb-2">Items</h4>
            <div className="space-y-3">
              {(form.items || []).map((it, idx) => (
                <div key={idx} className="p-3 border rounded-lg flex flex-col md:flex-row gap-3 items-start">
                  <textarea className="input md:flex-1" rows={2} value={it.text || ""} onChange={(e) => handleItemChange(idx, "text", e.target.value)} placeholder="Check description" />
                  <div className="w-40 flex flex-col gap-2">
                    <select className="input" value={it.status || "Pending"} onChange={(e) => handleItemChange(idx, "status", e.target.value)}>
                      <option>Pending</option>
                      <option>Completed</option>
                    </select>
                    <input className="input" placeholder="Comments" value={it.comments || ""} onChange={(e) => handleItemChange(idx, "comments", e.target.value)} />
                    <button type="button" onClick={() => removeItem(idx)} className="text-red-600 text-sm self-start">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <button type="button" onClick={addItem} className="btn-primary">+ Add Item</button>
              <button type="submit" disabled={loading} className="btn-primary">{loading ? "Updating..." : "Update Checklist"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
