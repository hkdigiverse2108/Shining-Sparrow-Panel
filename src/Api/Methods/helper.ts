export const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return envUrl.replace("localhost", window.location.hostname);
  }
  return envUrl;
};
