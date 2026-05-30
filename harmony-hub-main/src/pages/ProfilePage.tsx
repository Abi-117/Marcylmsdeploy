import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<any>(null);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState<any>({});

  const isStudent = user?.role === "student";

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        "https://marcylmsdeploy-2.onrender.com/api/auth/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data);
      setForm(res.data);
    };

    fetchUser();
  }, []);

  const updateProfile = async () => {
    const res = await axios.put(
      `https://marcylmsdeploy-2.onrender.com/api/${user.role}/me`,
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setUser(res.data);
    setEdit(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-4">

        <Avatar className="h-16 w-16">
          <AvatarFallback>
            {user.name?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.role}</p>
        </div>

      </div>

      {/* PROFILE IMAGE */}
      {user.image && (
        <img
          src={user.image}
          className="h-32 w-32 rounded-full object-cover border"
        />
      )}

      {/* VIEW MODE */}
      {!edit ? (
        <div className="space-y-2 text-sm border p-4 rounded-xl">

          <div>Email: {user.email}</div>

          {isStudent && (
            <>
              <div>Phone: {user.phone}</div>
              <div>Address: {user.address}</div>
              <div>Parent: {user.parentName}</div>
              <div>Course: {user.course?.name}</div>
              <div>Level: {user.level}</div>
              <div>Batch: {user.batch}</div>
              <div>Mode: {user.mode}</div>
              <div>
                Time: {user.fromTime} - {user.toTime}
              </div>
            </>
          )}

          {isStudent && (
            <Button onClick={() => setEdit(true)}>
              Edit Profile
            </Button>
          )}

        </div>
      ) : (
        /* EDIT MODE */
        <div className="space-y-3 border p-4 rounded-xl">

          <Input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            placeholder="Name"
          />

          <Input
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            placeholder="Phone"
          />

          <Input
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            placeholder="Address"
          />

          <Input
            value={form.parentName}
            onChange={(e) =>
              setForm({
                ...form,
                parentName: e.target.value,
              })
            }
            placeholder="Parent Name"
          />

          <div className="flex gap-2">
            <Button onClick={updateProfile}>Save</Button>
            <Button variant="outline" onClick={() => setEdit(false)}>
              Cancel
            </Button>
          </div>

        </div>
      )}

    </div>
  );
}