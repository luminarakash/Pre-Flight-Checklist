import React, { useEffect, useState } from "react";
import { getChecklists, deleteChecklist } from "../services/api";
import ChecklistView from "./ChecklistView";
import EditChecklistModal from "./EditChecklistModal";

export default function ChecklistList() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // checklist object to edit
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getChecklists();
      setLists(res.data || []);
    } catch (err) {
      console.error("Load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const onCreated = () => load();
    window.addEventListener("checklist:created", onCreated);
    return () => window.removeEventListener("checklist:created", onCreated);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this checklist?")) return;
    try {
      await deleteChecklist(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const openEdit = (checklist) => {
    setEditing(checklist);
    setModalOpen(true);
  };

  const onUpdated = (updated) => {
    // update in-place to avoid refetching (optional)
    setLists(prev => prev.map(item => item._id === updated._id ? updated : item));
    // also dispatch a global event if needed
    window.dispatchEvent(new CustomEvent("checklist:updated", { detail: updated }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Saved Checklists</h2>
        <div className="small-muted">{lists.length} records</div>
      </div>

      {loading && <div className="text-sm text-gray-500 mb-3">Loading...</div>}

      <div className="space-y-4">
        {lists.length === 0 && !loading && <div className="text-gray-500">No checklists yet.</div>}
        {lists.map((c) => (
          <div key={c._id} className="border rounded-lg p-4 hover:shadow transition bg-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-gray-800">{c.flightNumber} <span className="small-muted">• {new Date(c.date).toLocaleDateString()}</span></div>
                <div className="text-sm text-gray-600">{c.filedBy ? `Filed by ${c.filedBy}` : ""}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="text-sm text-blue-600">Edit</button>
                <button onClick={() => navigator.clipboard.writeText(window.location.origin + "?id=" + c._id)} className="text-sm small-muted">Share</button>
                <button onClick={() => handleDelete(c._id)} className="text-sm text-red-600">Delete</button>
              </div>
            </div>

            <div className="mt-3">
              <ChecklistView checklist={c} />
            </div>
          </div>
        ))}
      </div>

      {modalOpen && editing && (
        <EditChecklistModal
          open={modalOpen}
          checklist={editing}
          onClose={() => setModalOpen(false)}
          onUpdated={(updated) => onUpdated(updated)}
        />
      )}
    </div>
  );
}
