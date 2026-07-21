export default function errorHandler(err, req, res, next) {
  if (err?.stack) {
    console.error(err.stack);
  } else {
    console.error(err);
  }

  return res.status(500).json({ message: "Internal server error" });
}
