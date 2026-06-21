// Security: Sanitization helper (CommonJS version matching firebase.ts)
const sanitizeText = (text) => {
  if (!text) return "";
  let sanitized = text.replace(/<\/?[^>]+(>|$)/g, "");
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
  return sanitized.trim();
};

// Security UX: Auth Error mapping (CommonJS version matching firebase.ts)
const getErrorMessage = (error) => {
  if (!error) return "An unknown error occurred.";
  const code = error.code || error.message || "";
  
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password combination.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address format.";
    case "auth/weak-password":
      return "Password is too weak. Must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      if (typeof error === "string") return error;
      return error.message || "An unexpected validation error occurred.";
  }
};

module.exports = {
  sanitizeText,
  getErrorMessage,
};
