// src/pages/admin/AdminSettings.jsx
import React, { useState, useEffect, useRef } from "react";
import {
    Plus,
    Edit,
    Trash2,
    X,
    ChevronDown,
    ChevronRight,
    Image,
    Layers,
} from "lucide-react";
import ProductSkeleton from "../../components/ProductSkeleton";
import { API_BASE_URL } from "../../utils/apiHelpers";
import AlertModal from "../../components/admin/shared/AlertModal";

// ─── API helpers ────────────────────────────────────────────────────────────
const COLL_URL = `${API_BASE_URL}/collections`;

const api = {
    // Collections
    getCollections: () => fetch(COLL_URL).then((r) => r.json()),
    createCollection: (body) =>
        fetch(COLL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }).then((r) => r.json()),
    updateCollection: (id, body) =>
        fetch(`${COLL_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }).then((r) => r.json()),
    deleteCollection: (id) =>
        fetch(`${COLL_URL}/${id}`, { method: "DELETE" }).then((r) => r.json()),

    // Prints
    getPrints: (collId) =>
        fetch(`${COLL_URL}/${collId}/prints`).then((r) => r.json()),
    createPrint: (collId, formData) =>
        fetch(`${COLL_URL}/${collId}/prints`, {
            method: "POST",
            body: formData, // multipart
        }).then((r) => r.json()),
    updatePrint: (collId, printId, payload) => {
        // payload can be FormData (with image) or plain object (name only)
        if (payload instanceof FormData) {
            return fetch(`${COLL_URL}/${collId}/prints/${printId}`, {
                method: "PUT",
                body: payload,
            }).then((r) => r.json());
        }
        return fetch(`${COLL_URL}/${collId}/prints/${printId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).then((r) => r.json());
    },
    deletePrint: (collId, printId) =>
        fetch(`${COLL_URL}/${collId}/prints/${printId}`, {
            method: "DELETE",
        }).then((r) => r.json()),
};

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Inline modal for create/edit collection */
const CollectionModal = ({ initial, onSave, onClose }) => {
    const [form, setForm] = useState({
        name: initial?.name ?? "",
        description: initial?.description ?? "",
        isActive: initial?.isActive ?? true,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await onSave(form);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">
                        {initial ? "Edit Collection" : "New Collection"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                            {error}
                        </p>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            required
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Summer Vibes"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Short description…"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                        />
                    </div>
                    {initial && (
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) =>
                                    setForm({ ...form, isActive: e.target.checked })
                                }
                                className="rounded border-gray-300 text-pink-500 focus:ring-pink-400"
                            />
                            Active
                        </label>
                    )}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-md disabled:opacity-50"
                        >
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/** Inline modal for create/edit print */
const PrintModal = ({ collectionId, initial, onSave, onClose }) => {
    const [name, setName] = useState(initial?.name ?? "");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(initial?.image ?? null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const fileRef = useRef();

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!initial && !file) {
            setError("Please select an image.");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            let payload;
            if (file) {
                payload = new FormData();
                payload.append("name", name);
                payload.append("image", file);
            } else {
                payload = { name };
            }
            await onSave(payload);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">
                        {initial ? "Edit Print" : "Add Print"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                            {error}
                        </p>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Print Name *
                        </label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Floral Burst"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image {initial ? "(leave empty to keep current)" : "*"}
                        </label>
                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-full h-40 object-cover rounded-lg border border-gray-200 mb-2"
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-pink-400 hover:text-pink-600 transition-colors w-full justify-center"
                        >
                            <Image className="h-4 w-4" />
                            {file ? file.name : "Choose image…"}
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFile}
                            className="hidden"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-md disabled:opacity-50"
                        >
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/** Expanded prints panel for a single collection */
const PrintsPanel = ({ collection }) => {
    const [prints, setPrints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingPrint, setEditingPrint] = useState(null);

    // Confirm / error modal state
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, print: null });
    const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "error" });
    const showAlert = (title, message, type = "error") =>
        setAlertModal({ isOpen: true, title, message, type });

    const loadPrints = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getPrints(collection._id);
            const arr = Array.isArray(data) ? data : data.data ?? data.prints ?? [];
            setPrints(arr);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrints();
    }, [collection._id]);

    const handleCreate = async (payload) => {
        await api.createPrint(collection._id, payload);
        setShowModal(false);
        await loadPrints();
    };

    const handleEdit = async (payload) => {
        await api.updatePrint(collection._id, editingPrint._id, payload);
        setEditingPrint(null);
        await loadPrints();
    };

    const handleDeleteConfirmed = async () => {
        const print = confirmModal.print;
        setConfirmModal({ isOpen: false, print: null });
        try {
            const res = await api.deletePrint(collection._id, print._id);
            if (res?.success === false) {
                showAlert("Cannot Delete Print", res.message || "Failed to delete print.");
                return;
            }
            await loadPrints();
        } catch (err) {
            showAlert("Error", err.message || "Failed to delete print.");
        }
    };

    return (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            {/* Modals */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal((p) => ({ ...p, isOpen: false }))}
                title={alertModal.title}
                message={alertModal.message}
                type={alertModal.type}
            />
            <AlertModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, print: null })}
                onConfirm={handleDeleteConfirmed}
                title="Delete Print"
                message={`Are you sure you want to delete the print "${confirmModal.print?.name}"?`}
                type="warning"
                mode="confirm"
                confirmLabel="Delete"
            />
            {/* Prints header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    <Image className="h-4 w-4" /> Prints
                </span>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-pink-500 text-white text-xs font-semibold rounded-lg hover:bg-pink-600 transition-colors shadow-sm"
                >
                    <Plus className="h-3.5 w-3.5" /> Add Print
                </button>
            </div>

            {loading ? (
                <div className="py-6">
                    <ProductSkeleton count={4} columns="4cols" />
                </div>
            ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
            ) : prints.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                    No prints yet. Add one above.
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {prints.map((print) => (
                        <div
                            key={print._id}
                            className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            {print.image ? (
                                <img
                                    src={print.image}
                                    alt={print.name}
                                    className="w-full aspect-square object-cover"
                                />
                            ) : (
                                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                                    <Image className="h-8 w-8 text-gray-300" />
                                </div>
                            )}
                            <div className="px-2 py-1.5">
                                <p className="text-xs font-medium text-gray-700 truncate">
                                    {print.name}
                                </p>
                            </div>
                            {/* Hover action buttons */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={() => setEditingPrint(print)}
                                    className="p-1.5 bg-white rounded-full text-pink-600 hover:bg-pink-50 shadow transition-colors"
                                    title="Edit print"
                                >
                                    <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => setConfirmModal({ isOpen: true, print })}
                                    className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50 shadow transition-colors"
                                    title="Delete print"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <PrintModal
                    collectionId={collection._id}
                    onSave={handleCreate}
                    onClose={() => setShowModal(false)}
                />
            )}
            {editingPrint && (
                <PrintModal
                    collectionId={collection._id}
                    initial={editingPrint}
                    onSave={handleEdit}
                    onClose={() => setEditingPrint(null)}
                />
            )}
        </div>
    );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const AdminSettings = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    // Confirm / error modal state
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, collection: null });
    const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "", type: "error" });
    const showAlert = (title, message, type = "error") =>
        setAlertModal({ isOpen: true, title, message, type });

    const loadCollections = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getCollections();
            const arr = Array.isArray(data)
                ? data
                : data.data ?? data.collections ?? [];
            setCollections(arr);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCollections();
    }, []);

    const handleCreate = async (form) => {
        await api.createCollection(form);
        setShowModal(false);
        await loadCollections();
    };

    const handleEdit = async (form) => {
        await api.updateCollection(editingCollection._id, form);
        setEditingCollection(null);
        await loadCollections();
    };

    const handleDeleteConfirmed = async () => {
        const collection = confirmModal.collection;
        setConfirmModal({ isOpen: false, collection: null });
        try {
            const res = await api.deleteCollection(collection._id);
            if (res?.success === false) {
                showAlert("Cannot Delete Collection", res.message || "Failed to delete collection.");
                return;
            }
            await loadCollections();
        } catch (err) {
            showAlert("Error", err.message || "Failed to delete collection.");
        }
    };

    const toggleExpand = (id) =>
        setExpandedId((prev) => (prev === id ? null : id));

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Modals */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal((p) => ({ ...p, isOpen: false }))}
                title={alertModal.title}
                message={alertModal.message}
                type={alertModal.type}
            />
            <AlertModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, collection: null })}
                onConfirm={handleDeleteConfirmed}
                title="Delete Collection"
                message={`Are you sure you want to delete "${confirmModal.collection?.name}"? All its prints will also be removed.`}
                type="warning"
                mode="confirm"
                confirmLabel="Delete"
            />

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Layers className="h-6 w-6 text-pink-500" />
                        Collections &amp; Prints
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage print collections displayed on the homepage.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-md w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    New Collection
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="py-10 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
                            <div className="h-4 bg-gray-100 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : collections.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium">No collections yet</p>
                    <p className="text-sm mt-1">
                        Click "New Collection" to get started.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {collections.map((col) => {
                        const isExpanded = expandedId === col._id;
                        return (
                            <div
                                key={col._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                {/* Collection row */}
                                <div className="flex items-center gap-4 px-5 py-4">
                                    {/* Expand toggle */}
                                    <button
                                        onClick={() => toggleExpand(col._id)}
                                        className="text-gray-400 hover:text-pink-500 transition-colors flex-shrink-0"
                                        title={isExpanded ? "Collapse" : "Expand prints"}
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="h-5 w-5" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5" />
                                        )}
                                    </button>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-gray-800">
                                                {col.name}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${col.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                                    }`}
                                            >
                                                {col.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        {col.description && (
                                            <p className="text-sm text-gray-500 truncate mt-0.5">
                                                {col.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => setEditingCollection(col)}
                                            className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                                            title="Edit collection"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setConfirmModal({ isOpen: true, collection: col })}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete collection"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Prints panel (accordion) */}
                                {isExpanded && <PrintsPanel collection={col} />}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Collection modals */}
            {showModal && (
                <CollectionModal
                    onSave={handleCreate}
                    onClose={() => setShowModal(false)}
                />
            )}
            {editingCollection && (
                <CollectionModal
                    initial={editingCollection}
                    onSave={handleEdit}
                    onClose={() => setEditingCollection(null)}
                />
            )}
        </div>
    );
};

export default AdminSettings;
