export default function generateAvatar() {
  const isFemale = Math.random() < 0.5;
  const id = Math.floor(Math.random() * 99); // RandomUser has 0–99

  return isFemale
    ? `https://randomuser.me/api/portraits/women/${id}.jpg`
    : `https://randomuser.me/api/portraits/men/${id}.jpg`;
}
