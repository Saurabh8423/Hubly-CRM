import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, createUser } from "../../../api/users";
import AddMemberModal from "../../../components/dashboard/Team/AddMemberModal";
import { useNavigate } from "react-router-dom";
import "./Team.css";

// =============================
// NEW AVATAR CACHE + LOGIC
// =============================

// Load saved avatars from localStorage
const avatarCache = JSON.parse(localStorage.getItem("teamAvatars")) || {};

// New Avatar logic (based on first name → gender → cached)
const getAvatar = (user) => {
  const userId = user._id || user.id;

  // return from cache if exists
  if (avatarCache[userId]) {
    return avatarCache[userId];
  }

  // gender guess by name ending with "a"
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const isFemale = name.toLowerCase().endsWith("a");

  const randomIndex = Math.floor(Math.random() * 50);

  const avatarURL = isFemale
    ? `https://randomuser.me/api/portraits/women/${randomIndex}.jpg`
    : `https://randomuser.me/api/portraits/men/${randomIndex}.jpg`;

  // save to cache
  avatarCache[userId] = avatarURL;
  localStorage.setItem("teamAvatars", JSON.stringify(avatarCache));

  return avatarURL;
};

const Team = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      const data = res.data?.users || [];
      setUsers(data);
    } catch (err) {
      console.error("loadUsers err", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load logged-in user
  const fetchCurrentUser = async () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
        return;
      }
    } catch (err) {
      console.warn("Could not load current user", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      console.error("delete err", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (id) => {
    navigate(`/settings?userId=${id}`);
  };

  const handleAddSave = async (form) => {
    try {
      await createUser({
        firstName: form.firstName,
        lastName: form.lastName || "",
        email: form.email,
        phone: form.phone || "",
        role: form.designation === "Admin" ? "admin" : "member",
      });
      await loadUsers();
      setOpenModal(false);
    } catch (err) {
      console.error("create user err", err);
      alert(err.response?.data?.message || "Create failed");
    }
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="team-page">
      <h2>Team</h2>

      {loading ? (
        <div style={{ padding: 16 }}>Loading...</div>
      ) : (
        <table className="team-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const role = (u.role || "").toLowerCase();
                const isSelf =
                  currentUser &&
                  String(currentUser._id || currentUser.id) ===
                    String(u._id || u.id);

                // NEW Avatar logic (cached)
                const avatar = getAvatar(u);

                return (
                  <tr key={u._id || u.id}>
                    <td style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img
                        src={avatar}
                        alt="avatar"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <div>{`${u.firstName || ""} ${u.lastName || ""}`.trim()}</div>
                    </td>
                    <td>{u.phone || "-"}</td>
                    <td>{u.email}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {role || "member"}
                    </td>

                    <td>
                      {/* EDIT button visible only for Admin or Self */}
                      <button
                        className={`edit-btn ${
                          !(isAdmin || isSelf) ? "disabled" : ""
                        }`}
                        onClick={() => {
                          if (isAdmin || isSelf) {
                            localStorage.setItem("editUser", JSON.stringify(u));
                            navigate("/settings");
                          }
                        }}
                        disabled={!(isAdmin || isSelf)}
                      >
                        🖍
                      </button>

                      {/* DELETE button visible only for Admin or Self */}
                      <button
                        className={`delete-btn ${
                          !(isAdmin || isSelf) ? "disabled" : ""
                        }`}
                        onClick={() => {
                          if (isAdmin || isSelf) handleDelete(u._id || u.id);
                        }}
                        disabled={!(isAdmin || isSelf)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      <div className="team-Add">
        <button className="add-member-btn" onClick={() => setOpenModal(true)}>
          + Add Member
        </button>
      </div>

      {openModal && (
        <AddMemberModal
          onClose={() => setOpenModal(false)}
          onSave={handleAddSave}
        />
      )}
    </div>
  );
};

export default Team;
