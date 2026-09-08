import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import ProfileInfoItem from "../components/ProfileInfoItem";
import { BackendUrl } from "../core";
import { store, type User } from "../store/states";
import { useParams } from "react-router-dom";
import { CiEdit } from "react-icons/ci";

const Profile = () => {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;

  const { setUser } = store();

  const [profileUser, setProfileUser] = useState<User | null>(null);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getOtherProfile();
    getOtherUserPosts();
  }, [userId]);

  const handleCancel = () => {
    if (profileUser) {
      setFirstname(profileUser.firstname || "");
      setLastname(profileUser.lastname || "");
      setUsername(profileUser.username || "");
    }

    setEditing(false);
  };

  const getOtherProfile = async () => {
    setProfileLoading(true);

    try {
      const profileEndpoint = userId
        ? `${BackendUrl}/api/v1/profile/${userId}`
        : `${BackendUrl}/api/v1/profile`;

      const response = await axios.get(profileEndpoint, {
        headers: {
          authorizedtoken: localStorage.getItem("token"),
        },
      });

      const profileData: User = response.data.data;

      setProfileUser(profileData);
      setFirstname(profileData.firstname || "");
      setLastname(profileData.lastname || "");
      setUsername(profileData.username || "");

      if (!userId) {
        setUser(profileData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProfileLoading(false);
    }
  };

  const getOtherUserPosts = async () => {
    try {
      const response = await axios.get(
        `${BackendUrl}/api/v1/profile/posts/${userId}`,
        {
          headers: {
            authorizedtoken: localStorage.getItem("token"),
          },
        },
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error While fetching other user's posts:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstname.trim()) {
      alert("Firstname is required");
      return;
    }

    if (!lastname.trim()) {
      alert("Lastname is required");
      return;
    }

    if (!username.trim()) {
      alert("Username is required");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BackendUrl}/api/v1/profile`,
        {
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          username: username.trim(),
        },
        {
          headers: {
            authorizedtoken: token,
          },
        },
      );

      const updatedUser: User = response.data.data;

      setProfileUser(updatedUser);
      setUser(updatedUser);
      setEditing(false);

      alert("Profile updated successfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Update failed");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      e.target.value = "";
      return;
    }

    if (file.size > 2_000_000) {
      alert("Image must be smaller than 2 MB");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setAvatarLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BackendUrl}/api/v1/profile/avatar`,
        formData,
        {
          headers: {
            authorizedtoken: token,
          },
        },
      );

      const updatedUser: User = response.data.data;

      setProfileUser(updatedUser);
      setUser(updatedUser);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Avatar upload failed");
      } else {
        alert("Avatar upload failed");
      }
    } finally {
      setAvatarLoading(false);
      e.target.value = "";
    }
  };

  const initial = profileUser?.firstname?.charAt(0).toUpperCase() || "?";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 px-4 py-10 font-sans">
        <div className="mx-auto max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {editing ? "Edit Profile" : "My Profile"}
              </h1>
              <p className="text-sm text-slate-500">
                {editing
                  ? "Update your personal information."
                  : "Manage your account details."}
              </p>
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-8 relative">
              <div className="relative">
                {/* Avatar Image */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200">
                  {profileLoading ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                  ) : profileUser?.profileimg ? (
                    <img
                      src={profileUser.profileimg}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-blue-400 to-blue-600 text-white font-bold text-xl uppercase">
                      {initial}
                    </div>
                  )}
                </div>

                {/* Edit Avatar Button */}
                {!userId && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 cursor-pointer bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-lg transition"
                    title="Change profile picture"
                  >
                    {avatarLoading ? (
                      <svg
                        className="h-4 w-4 animate-spin text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3z"
                        />
                      </svg>
                    ) : (
                      <CiEdit className="h-5 w-5 text-white" />
                    )}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Content Area */}
            {profileLoading ? (
              <div className="space-y-4">
                <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              </div>
            ) : editing && !userId ? (
              // Edit Form
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Enter firstname"
                    label="Firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                  <Input
                    placeholder="Enter lastname"
                    label="Lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
                <Input
                  placeholder="Enter username"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 font-semibold rounded-xl py-3 transition"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 transition"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent border-b-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              // Profile Details View
              <div className="space-y-4 text-slate-800">
                {/* Firstname & Lastname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ProfileInfoItem
                    label="Firstname"
                    value={profileUser?.firstname || "-"}
                  />
                  <ProfileInfoItem
                    label="Lastname"
                    value={profileUser?.lastname || "-"}
                  />
                </div>
                {/* Username */}
                <ProfileInfoItem
                  label="Username"
                  value={`@${profileUser?.username || "-"}`}
                />
                {/* Email */}
                <ProfileInfoItem
                  label="Email"
                  value={profileUser?.email || "-"}
                />

                {/* Edit Button */}
                {!userId && (
                  <Button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 shadow-md transition active:scale-95"
                  >
                    <CiEdit className="inline-block mr-2 h-5 w-5" />
                    Update Profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
