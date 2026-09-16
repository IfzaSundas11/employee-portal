"use client";

import { useEffect, useState } from "react";
import { Mail, Shield, Calendar, Phone } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setIsEditing(false);
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      setMessage("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!profile) return;
    setPwLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Reset link generated! Check server console (or your email).");
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Failed to send reset request.");
    } finally {
      setPwLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8">
        <p className="text-red-500 text-sm">
          Could not load profile. Please make sure you're logged in.
        </p>
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || profile.username;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 max-w-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400" />

        <div className="px-8 pb-8">
          <div className="-mt-12 mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600 border-4 border-white shadow-md">
              {fullName.charAt(0).toUpperCase()}
            </div>
          </div>

          {!isEditing ? (
            <>
              <h2 className="text-xl font-bold text-slate-800">{fullName}</h2>
              <p className="text-sm text-slate-500 mb-6">{profile.role}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{profile.email}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">
                    {profile.phone || "No phone number added"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{profile.role}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">
                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>

                <button
                  onClick={handleChangePassword}
                  disabled={pwLoading}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                >
                  {pwLoading ? "Sending..." : "Change Password"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-slate-800 mb-4">Edit Profile</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="03xxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400"
                  />
                  <p className="text-xs text-slate-400 mt-1">Email cannot be changed here.</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setForm({
                      firstName: profile.firstName || "",
                      lastName: profile.lastName || "",
                      phone: profile.phone || "",
                    });
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}

          {message && (
            <p className="mt-4 text-sm text-slate-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}