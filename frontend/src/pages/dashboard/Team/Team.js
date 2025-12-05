import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, createUser } from "../../../api/users";
import AddMemberModal from "../../../components/dashboard/Team/AddMemberModal";
import { useNavigate } from "react-router-dom";
import "./Team.css";

// =============================
// AVATAR CACHE + LOGIC
// =============================
const avatarCache = JSON.parse(localStorage.getItem("teamAvatars")) || {};

const getAvatar = (user) => {
  const userId = user._id || user.id;

  if (avatarCache[userId]) return avatarCache[userId];

  const full = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const isFemale = full.toLowerCase().endsWith("a");
  const randomIndex = Math.floor(Math.random() * 50);

  const avatarURL = isFemale
    ? `https://randomuser.me/api/portraits/women/${randomIndex}.jpg`
    : `https://randomuser.me/api/portraits/men/${randomIndex}.jpg`;

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

  // =============================
  // LOAD USERS
  // =============================
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data?.users || []);
    } catch (err) {
      console.error("loadUsers err", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // LOAD CURRENT LOGGED USER
  // =============================
  const fetchCurrentUser = () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Could not load current user", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    loadUsers();
  }, []);

  // =============================
  // DELETE USER
  // =============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      console.error("delete err", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // =============================
  // ADD USER
  // =============================
  const handleAddSave = async (form) => {
    try {
      const payload = {
        firstName: form.firstName,
        email: form.email,
        role: "member",
        designation: form.designation,
        password: form.email,
        phone: "",
      };

      const res = await createUser(payload);

      setUsers((prev) => [...prev, res.data.user]);
      setOpenModal(false);
    } catch (err) {
      console.error("create user err", err);
      alert(err.response?.data?.message || "User creation failed.");
    }
  };

  return (
    <div className="team-page">
      <h2>Team {currentUser && `(${currentUser.role})`}</h2>

      {loading ? (
        <div className="loading">Loading...</div>
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
                <td colSpan="5" className="no-users">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const avatar = getAvatar(u);

                return (
                  <tr key={u._id || u.id}>
                    <td className="user-info">
                      <img src={avatar} alt="avatar" className="avatar" />
                      <span>{`${u.firstName || ""} ${u.lastName || ""
                        }`.trim()}</span>
                    </td>

                    <td>{u.phone || "-"}</td>
                    <td>{u.email}</td>
                    <td className="role-text">
                      {(u.role || "member").toLowerCase()}
                    </td>

                    <td>
                      {/* EDIT + DELETE only for members */}
                      {u.role?.toLowerCase() === "member" && (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => {
                              localStorage.setItem(
                                "editUser",
                                JSON.stringify(u)
                              );
                              navigate("/dashboard/settings", {
                                state: {
                                  editUserId: u._id,
                                },
                              });
                            }}
                          >
                            🖍
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(u._id || u.id)}
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      <div className="team-add">
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
