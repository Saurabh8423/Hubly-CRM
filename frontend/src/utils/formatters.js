// Format ISO date → "Jan 5, 2025 10:24 AM"
export const formatDate = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleString();
};

// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "-";
  return num.toLocaleString();
};

// Short text preview (for ticket messages)
export const shortenText = (text, length = 80) => {
  if (!text) return "";
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
