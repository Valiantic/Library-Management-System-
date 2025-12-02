import { useState, useEffect } from "react";
import { generatePassword } from "../utils/passwordGenerator";
import { validatePassword } from "../utils/passwordValidator";
import { MdVisibility, MdVisibilityOff, MdVpnKey } from "react-icons/md";

export default function EditMemberModal({ open, onClose, onEdit, member }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    userName: "",
    password: "",
    role: "student",
    status: "active"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleGeneratePassword = () => {
    setForm((prev) => ({ ...prev, password: generatePassword() }));
  };

  useEffect(() => {
    if (member) {
      setForm({
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        emailAddress: member.emailAddress || "",
        userName: member.userName || "",
        password: "",
        role: member.role || "student",
        status: member.status || "active"
      });
    }
  }, [member, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (form.password && form.password.length > 0) {
      const passwordError = validatePassword(form.password);
      if (passwordError) {
        setError(passwordError);
        setLoading(false);
        return;
      }
    }
    try {
      await onEdit(form);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  // Close modal if click on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-40" onMouseDown={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute text-lg top-2 right-2 text-gray-400 hover:text-gray-600">&times;</button>
        <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Member</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">

            <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="First Name" className="w-1/2 px-3 py-2 border border-2 border-gray-300 text-black rounded focus:ring focus:ring-blue-200" />
            <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Last Name" className="w-1/2 px-3 py-2 border border-2 border-gray-300 text-black rounded focus:ring focus:ring-blue-200" />
          </div>
          <input name="emailAddress" value={form.emailAddress} onChange={handleChange} required type="email" placeholder="Email Address" className="w-full px-3 py-2 border border-2 border-gray-300 text-black rounded focus:ring focus:ring-blue-200" />
          <input name="userName" value={form.userName} onChange={handleChange} required placeholder="Username" className="w-full px-3 py-2 border border-2 border-gray-300 text-black rounded focus:ring focus:ring-blue-200" />
          <div className="relative flex items-center">
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="New Password (leave blank to keep current)"
              className="w-full px-3 py-2 border border-2 border-gray-300 text-xs text-black rounded focus:ring focus:ring-blue-200 pr-20 md:pr-24"
            />
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="absolute right-12 text-white md:right-20 flex items-center justify-center p-1 text-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              tabIndex={-1}
              aria-label="Generate Password"
            >
              <MdVpnKey />
            </button>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 text-white flex items-center justify-center p-1 text-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              tabIndex={-1}
              aria-label={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border border-2 border-gray-300 text-black rounded focus:ring focus:ring-blue-200">
            <option value="student">User</option>
            <option value="admin">Admin</option>
          </select>
          <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-2 border-gray-300 text-black rounded focus:ring focus:ring-blue-200">
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}
