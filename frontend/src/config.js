export const CONFIG = {
  API_BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",

  APP_NAME: "AI Contact Suite",

  DEFAULT_LANGUAGE: "en",
  THEME: "light",

  // Pagination defaults
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,

  // Toast timeout
  TOAST_DURATION: 3000
};

export default CONFIG;
