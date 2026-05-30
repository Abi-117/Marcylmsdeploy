import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/auth";

type UserType = {
  name: string;
  email: string;
  phone?: string;
  role: string;

  course?: string;
  level?: string;
  batch?: string;

  parentName?: string;
  address?: string;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState<UserType | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState<UserType>({
    name: "",
    email: "",
    phone: "",
    role: "",
    course: "",
    level: "",
    batch: "",
    parentName: "",
    address: "",
  });

  // =========================
  // FETCH PROFILE
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://marcylmsdeploy-2.onrender.com/api/users/me",
          {
            headers: {
              Authorization: token || "",
            },
          }
        );

        const data = res.data;

        setProfile(data);

        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "",

          course: data.course || "",
          level: data.level || "",
          batch: data.batch || "",

          parentName: data.parentName || "",
          address: data.address || "",
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "https://marcylmsdeploy-2.onrender.com/api/users/profile",
        form,
        {
          headers: {
            Authorization: token || "",
          },
        }
      );

      setProfile(res.data);
      setEditMode(false);

      alert("Profile updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* CARD */}
      <div className="border rounded-2xl p-6 shadow space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">My Profile</h2>

          <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">
            {editMode ? "EDIT MODE" : "VIEW MODE"}
          </span>
        </div>

        {/* BASIC */}
        <Input
          disabled={!editMode}
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          placeholder="Name"
        />

        <Input
          disabled={!editMode}
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          placeholder="Email"
        />

        <Input
          disabled={!editMode}
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          placeholder="Phone"
        />

        {/* EXTRA FIELDS */}
        <Input
          disabled={!editMode}
          value={form.parentName}
          onChange={(e) =>
            setForm({ ...form, parentName: e.target.value })
          }
          placeholder="Parent Name"
        />

        <Input
          disabled={!editMode}
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
          placeholder="Address"
        />

        {/* STUDENT INFO (READ ONLY) */}
        {profile.role === "student" && (
          <div className="border-t pt-3 space-y-2 text-sm">
            <Input value={form.course} disabled />
            <Input value={form.level} disabled />
            <Input value={form.batch} disabled />
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-3 pt-4">

          {editMode ? (
            <>
              <Button onClick={handleUpdate}>
                Save
              </Button>

              <Button
                variant="ghost"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}

        </div>

      </div>

    </div>
  );
}