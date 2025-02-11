export const handleError = (res, error, message = "Internal Server Error") => {
  console.error(error);
  return res.status(500).json({ error: message });
};
