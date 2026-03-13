import React, { useState, useEffect } from "react";
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from "../../services/firestoreService";
import Spinner from "../../components/Spinner/Spinner";
import Footer from "../../components/Footer/Footer";
import "./AdminMenu.css";

const EMPTY_ITEM = {
  itemName: "",
  description: "",
  price: "",
  category: "Lunch",
  imageURL: "",
  available: true,
};

const CATEGORIES = ["Breakfast", "Lunch", "Snacks", "Beverages", "Desserts"];

function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_ITEM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");

  async function loadItems() {
    setLoading(true);
    try {
      const data = await getMenuItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function openAddModal() {
    setForm(EMPTY_ITEM);
    setEditId(null);
    setShowModal(true);
  }

  function openEditModal(item) {
    setForm({
      itemName: item.itemName,
      description: item.description,
      price: item.price,
      category: item.category,
      imageURL: item.imageURL || "",
      available: item.available,
    });
    setEditId(item.itemId);
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price) };
      if (editId) {
        await updateMenuItem(editId, data);
      } else {
        await addMenuItem(data);
      }
      setShowModal(false);
      await loadItems();
    } catch (err) {
      console.error(err);
      alert("Failed to save item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(itemId) {
    try {
      await deleteMenuItem(itemId);
      setDeleteConfirm(null);
      await loadItems();
    } catch (err) {
      console.error(err);
      alert("Failed to delete item.");
    }
  }

  async function toggleAvailability(item) {
    await updateMenuItem(item.itemId, { available: !item.available });
    await loadItems();
  }

  const filtered = items.filter(
    (i) =>
      i.itemName?.toLowerCase().includes(search.toLowerCase()) ||
      i.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner message="Loading menu..." />;

  return (
    <div className="admin-menu-page page-wrapper">
      <div className="admin-menu-container">
        {/* Header */}
        <div className="admin-menu-header">
          <div>
            <h1 className="admin-menu-title">Menu Management 🍱</h1>
            <p className="admin-menu-subtitle">{items.length} items in menu</p>
          </div>
          <button className="btn-add-item" onClick={openAddModal}>
            <i className="fas fa-plus"></i> Add Item
          </button>
        </div>

        {/* Search */}
        <div className="admin-search-wrapper">
          <i className="fas fa-search admin-search-icon"></i>
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>

        {/* Menu Grid */}
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div style={{ fontSize: "3rem" }}>🔍</div>
            <p>No items found. Add new items to the menu.</p>
          </div>
        ) : (
          <div className="admin-menu-grid">
            {filtered.map((item) => (
              <div key={item.itemId} className={`admin-menu-card ${!item.available ? "unavailable-card" : ""}`}>
                <div className="admin-menu-img">
                  {item.imageURL ? (
                    <img src={item.imageURL} alt={item.itemName} />
                  ) : (
                    <span className="admin-menu-placeholder">🍽️</span>
                  )}
                  <span className="admin-category-tag">{item.category}</span>
                </div>
                <div className="admin-menu-body">
                  <h5 className="admin-item-name">{item.itemName}</h5>
                  <p className="admin-item-desc">{item.description}</p>
                  <div className="admin-item-footer">
                    <span className="admin-item-price">₹{item.price}</span>
                    <div className="admin-item-actions">
                      <button
                        className={`toggle-btn ${item.available ? "available" : "not-available"}`}
                        onClick={() => toggleAvailability(item)}
                        title={item.available ? "Mark unavailable" : "Mark available"}
                      >
                        <i className={`fas fa-${item.available ? "check" : "times"}`}></i>
                      </button>
                      <button className="edit-btn" onClick={() => openEditModal(item)} title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="delete-btn" onClick={() => setDeleteConfirm(item.itemId)} title="Delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? "Edit Item" : "Add New Item"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="modal-form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  value={form.itemName}
                  onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                  required
                  placeholder="e.g. Veg Thali"
                />
              </div>
              <div className="modal-form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={2}
                />
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min="1"
                    placeholder="50"
                  />
                </div>
                <div className="modal-form-group">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-form-group">
                <label>Image URL (optional)</label>
                <input
                  type="url"
                  value={form.imageURL}
                  onChange={(e) => setForm({ ...form, imageURL: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="modal-form-check">
                <input
                  type="checkbox"
                  id="available"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                />
                <label htmlFor="available">Available for ordering</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel-modal" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save-modal" disabled={saving}>
                  {saving ? "Saving..." : editId ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h4>Delete Item?</h4>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-cancel-modal" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AdminMenu;
