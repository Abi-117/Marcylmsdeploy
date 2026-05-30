import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserType = {
  name: string;
  email: string;
  phone?: string;
  role: string;
  course?: string;
  level?: string;
  batch?: string;
  availableDays?: string[];
  fromTime?: string;
  toTime?: string;
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
  });

  // =========================
  // FETCH PROFILE
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://marcylmsdeploy-2.onrender.com/api/auth/me",
          {
            headers: {
              Authorization: token || "",
            },
          }
        );

        setProfile(res.data);
        setForm(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // UPDATE PROFILE (future)
  // =========================
  const handleUpdate = async () => {
    try {
      await axios.put(
        "https://marcylmsdeploy-2.onrender.com/api/users/profile",
        form,
        {
          headers: {
            Authorization: token || "",
          },
        }
      );

      alert("Profile updated");
      setEditMode(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* PROFILE CARD */}
      <div className="rounded-2xl border p-6 shadow">
        <h2 className="text-xl font-bold">My Profile</h2>

        <div className="mt-4 space-y-3">

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

          {/* STUDENT EXTRA DETAILS */}
          {profile.role === "student" && (
            <>
              <Input value={form.course} disabled />
              <Input value={form.level} disabled />
              <Input value={form.batch} disabled />
            </>
          )}

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-5">

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