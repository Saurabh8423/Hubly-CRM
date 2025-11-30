const avatarCache = JSON.parse(localStorage.getItem("ticketAvatars")) || {};

// Generate avatar from name or user role
export const getAvatar = (id, name = "", role = "user") => {
  if (avatarCache[id]) return avatarCache[id];

  const isFemale = name.toLowerCase().endsWith("a");
  const randomIndex = Math.floor(Math.random() * 50);

  let avatarURL = "";
  if (role === "admin") {
    avatarURL = `https://randomuser.me/api/portraits/lego/1.jpg`;    // admin icon
  } else if (role === "agent" || role === "member" || role === "teammate") {
    avatarURL = `https://randomuser.me/api/portraits/lego/2.jpg`;    // teammate icon
  } else {
    avatarURL = isFemale
      ? `https://randomuser.me/api/portraits/women/${randomIndex}.jpg`
      : `https://randomuser.me/api/portraits/men/${randomIndex}.jpg`;
  }

  avatarCache[id] = avatarURL;
  localStorage.setItem("ticketAvatars", JSON.stringify(avatarCache));

  return avatarURL;
};
