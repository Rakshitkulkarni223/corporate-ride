import { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_BASE_URL;

export default function App() {
  const [step, setStep] = useState("login");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    officeId: null,
    idProof: null,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, { phone });
      setUser(res.data.user);
    } catch {
      alert("User not found. Please sign up.");
      setForm({ ...form, phone });
      setStep("signup");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => data.append(key, val));
    try {
      const res = await axios.post(`${API}/signup`, data);
      setUser(res.data.user);
    } catch (err) {
      alert("Signup failed");
    }
  };

  if (user) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
        <p>Your registered phone: {user.phone}</p>
      </div>
    );
  }

  if (step === "login") {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">CorporateRide Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">CorporateRide Sign Up</h1>
      <form onSubmit={handleSignup} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <label className="block">Upload Office ID:
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, officeId: e.target.files[0] })} className="mt-1" required />
        </label>
        <label className="block">Upload Aadhar/PAN:
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, idProof: e.target.files[0] })} className="mt-1" required />
        </label>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}
