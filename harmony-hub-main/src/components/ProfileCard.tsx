import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

type UserType = {
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: "student" | "teacher" | "admin";
  profileImage?: string;
  address?: string;
  parentName?: string;
};

type Props = {
  user: UserType;
  token: string;
};

export function ProfileCard({ user, token }: Props) {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://marcylmsdeploy-2.onrender.com/api/profile/me",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setProfile(res.data);
      } catch (err) {
        console.log("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [token]);

  if (!profile) return null;

  const isStudent = profile.role === "student";

  return (
    <div className="p-3 border rounded-xl bg-card space-y-3">

      {/* PROFILE IMAGE */}
      <img
        src={
          profile.profileImage ||
          "https://via.placeholder.com/80"
        }
        className="h-14 w-14 rounded-full object-cover border"
      />

      {/* BASIC INFO */}
      <div>
        <div className="font-semibold">{profile.name}</div>
        <div className="text-xs text-muted-foreground capitalize">
          {profile.role}
        </div>
      </div>

      {/* STUDENT EXTRA DETAILS */}
      {isStudent && (
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>📧 {profile.email}</p>
          <p>📞 {profile.phone}</p>
          <p>🏠 {profile.address || "No address"}</p>
          <p>
            👨‍👩‍👧 Parent: {profile.parentName || "Not added"}
          </p>
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setOpen(true)}>
          View Profile
        </Button>

        {isStudent && (
          <Button size="sm" variant="outline">
            Edit Profile
          </Button>
        )}
      </div>

      {/* VIEW MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-[320px] space-y-2">

            <h2 className="text-lg font-bold">Profile</h2>

            <img
              src={
                profile.profileImage ||
                "https://via.placeholder.com/80"
              }
              className="h-16 w-16 rounded-full object-cover"
            />

            <p><b>Name:</b> {profile.name}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Phone:</b> {profile.phone}</p>
            <p><b>Role:</b> {profile.role}</p>

            {isStudent && (
              <>
                <p><b>Address:</b> {profile.address}</p>
                <p><b>Parent:</b> {profile.parentName}</p>
              </>
            )}

            <Button className="mt-3 w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}