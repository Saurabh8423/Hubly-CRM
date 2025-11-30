// Email validation
export const isEmail = (value) => {
  const pattern = /^\S+@\S+\.\S+$/;
  return pattern.test(value);
};

// Phone validation (7–15 digits, spaces, +, - allowed)
export const isPhone = (value) => {
  const pattern = /^[0-9\-\+\s]{7,15}$/;
  return pattern.test(value);
};

// Password: 8+ chars, 1 number, 1 special char
export const isStrongPassword = (value) => {
  const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
  return pattern.test(value);
};

// Required field
export const isRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== "";
};
