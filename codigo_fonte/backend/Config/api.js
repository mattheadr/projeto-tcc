export const api = {
  base:
   process.env.EXPO_PUBLIC_API_HOST || "http://10.0.2.2:3000",
  headers: {
    "Content-Type": "application/json",
  },
};
