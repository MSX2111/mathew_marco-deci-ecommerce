export const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const parseUserId = (req) => toNumber(req.headers?.["x-user-id"]);

export const jsonError = (
  res,
  message = "Internal server error",
  status = 500,
) => res.status(status).json({ message });

export const buildUpdatePayload = (data, allowedFields = []) =>
  Object.fromEntries(
    Object.entries(data)
      .filter(
        ([key, value]) =>
          (allowedFields.length === 0 || allowedFields.includes(key)) &&
          value !== undefined &&
          value !== null &&
          value !== "",
      )
      .map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ]),
  );
