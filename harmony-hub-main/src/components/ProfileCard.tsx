import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type UserType = {
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: "student" | "teacher" | "admin";
  profileImage?: string;
};

type Props = {
  user: UserType;
  token: string;
};

export function ProfileCard({ user, token }: Props) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://marcylmsdeploy-2.onrender.com/api/users/me",
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

  return (
    <div
      className="p-3 cursor-pointer hover:bg-muted transition rounded-xl">
      <div className="flex items-center gap-3">
        <img
          src={
            profile.profileImage ||
            "https://via.placeholder.com/80"
          }
          alt="profile"
          className="h-12 w-12 rounded-full object-cover border"
        />

        <div>
          <p className="font-semibold text-sm">
            {profile.name}
          </p>

          <p className="text-xs text-muted-foreground capitalize">
            {profile.role}
          </p>
        </div>
      </div>
    </div>
  );
}