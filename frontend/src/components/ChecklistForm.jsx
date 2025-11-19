import React, { useState } from "react";
import { createChecklist } from "../services/api";

const DEFAULT_ITEMS = [
  { text: "Check Digital Sky for airspace clearance", status: "Pending", comments: "" },
  { text: "WINDY DATA- at 0m alt, at 100m alt", status: "Pending", comments: "" },
  { text: "Anemometer wind speed & Wind Direction", status: "Pending", comments: "" }
];

export default function ChecklistForm() {
  const [form, setForm] = useState({
    flightNumber: "",
    date: "",
    filedBy: "",
    filingTime: "",
    departureLocation: "",
    departureTime: "",
    arrivalLocation: "",
    estArrivalTime: "",
    items: DEFAULT_ITEMS,
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null); // {type:'success'|'error', text}

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleItemChange = (idx, key, value) => {
    setForm(prev => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], [key]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setForm(prev => ({ ...prev, items: [...prev.items, { text: "", status: "Pending", comments: "" }] }));
  };

  const removeItem = (idx) => {
    setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.flightNumber || !form.date) {
      setNotice({ type: "error", text: "Flight Number and Date are required." });
      return;
    }
    setLoading(true);
    setNotice(null);

    try {
      const payload = { ...form };
      if (!payload.filingTime) payload.filingTime = new Date().toLocaleTimeString();

      const res = await createChecklist(payload);
      setNotice({ type: "success", text: "Checklist created successfully." });

      // dispatch event so list reloads
      window.dispatchEvent(new CustomEvent("checklist:created", { detail: res.data }));

      // reset form (keep defaults)
      setForm({
        flightNumber: "",
        date: "",
        filedBy: "",
        filingTime: "",
        departureLocation: "",
        departureTime: "",
        arrivalLocation: "",
        estArrivalTime: "",
        items: DEFAULT_ITEMS,
      });
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || "Failed to create checklist.";
      setNotice({ type: "error", text: message });
    } finally {
      setLoading(false);
      // auto-hide notice after 3.5s
      setTimeout(() => setNotice(null), 3500);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Create New Checklist</h2>

      {notice && (
        <div className={`mb-4 p-3 rounded ${notice.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {notice.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="input" placeholder="Flight Number *" value={form.flightNumber} onChange={(e) => handleChange("flightNumber", e.target.value)} />
          <input className="input" type="date" placeholder="Date *" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
          <input className="input" placeholder="Filed By" value={form.filedBy} onChange={(e) => handleChange("filedBy", e.target.value)} />
          <input className="input" placeholder="Filing Time (optional)" value={form.filingTime} onChange={(e) => handleChange("filingTime", e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="input" placeholder="Departure Location" value={form.departureLocation} onChange={(e) => handleChange("departureLocation", e.target.value)} />
          <input className="input" placeholder="Departure Time" value={form.departureTime} onChange={(e) => handleChange("departureTime", e.target.value)} />
          <input className="input" placeholder="Arrival Location" value={form.arrivalLocation} onChange={(e) => handleChange("arrivalLocation", e.target.value)} />
          <input className="input" placeholder="Estimated Arrival Time" value={form.estArrivalTime} onChange={(e) => handleChange("estArrivalTime", e.target.value)} />
        </div>

        <div>
          <h3 className="font-medium mb-2">Preflight Checks</h3>

          <div className="space-y-3">
            {form.items.map((it, idx) => (
              <div key={idx} className="p-3 border rounded-lg bg-white/80 flex flex-col md:flex-row gap-3 items-start">
                <textarea className="input md:flex-1" rows={2} value={it.text} onChange={(e) => handleItemChange(idx, "text", e.target.value)} placeholder="Check description" />
                <div className="w-40 flex flex-col gap-2">
                  <select className="input" value={it.status} onChange={(e) => handleItemChange(idx, "status", e.target.value)}>
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>
                  <input className="input" placeholder="Comments" value={it.comments} onChange={(e) => handleItemChange(idx, "comments", e.target.value)} />
                  <button type="button" onClick={() => removeItem(idx)} className="text-red-600 text-sm mt-1 self-start">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <button type="button" onClick={addItem} className="btn-primary px-3 py-2 mr-2">+ Add Item</button>
            <button type="submit" className="btn-primary">{loading ? "Saving..." : "Save Checklist"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
