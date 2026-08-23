const log = (level, message, meta = {}) => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    }),
  );
};

export const info = (message, meta = {}) => log("info", message, meta);

export const error = (message, meta = {}) => log("error", message, meta);
