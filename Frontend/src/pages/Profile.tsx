import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { BackendUrl } from "../core";
import { store } from "../store/states";

const Profile = () => {
  const { user, setUser } = store();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setUsername(user.username || "");
    }
  }, [user]);

  const handleCancel = () => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setUsername(user.username || "");
    }
    setEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstname.trim()) return alert("Firstname is required");
    if (!lastname.trim()) return alert("Lastname is required");
    if (!username.trim()) return alert("Username is required");

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

      setUser(response.data.data);
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

  const initial = user?.firstname?.charAt(0).toUpperCase() || "?";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto flex w-full max-w-md items-center justify-center">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {editing ? "Edit Profile" : "My Profile"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {editing
                  ? "Update your personal information"
                  : "Your account details"}
              </p>
            </div>

            {/* Avatar */}
            <div className="mb-6 flex justify-center">
              <span className="grid h-24 w-24 place-items-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                {initial}
              </span>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 rounded-sm border border-gray-300 bg-white h-10 flex justify-center items-center text-gray-700 cursor-pointer hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-blue-500 rounded-sm h-10 flex justify-center items-center text-white cursor-pointer hover:bg-blue-600 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <span className="mb-2 block text-sm font-medium text-gray-500">
                      Firstname
                    </span>
                    <span className="block rounded-sm border border-gray-300 px-3 py-2 text-gray-900 font-medium">
                      {user?.firstname || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="mb-2 block text-sm font-medium text-gray-500">
                      Lastname
                    </span>
                    <span className="block rounded-sm border border-gray-300 px-3 py-2 text-gray-900 font-medium">
                      {user?.lastname || "-"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-sm font-medium text-gray-500">
                    Username
                  </span>
                  <span className="block rounded-sm border border-gray-300 px-3 py-2 text-gray-900 font-medium">
                    @{user?.username || "-"}
                  </span>
                </div>

                <div>
                  <span className="mb-2 block text-sm font-medium text-gray-500">
                    Email
                  </span>
                  <span className="block rounded-sm border border-gray-300 px-3 py-2 text-gray-900 font-medium">
                    {user?.email || "-"}
                  </span>
                </div>

                <Button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="bg-blue-500 rounded-sm w-full h-10 flex justify-center items-center text-white cursor-pointer hover:bg-blue-600"
                >
                  Update Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
