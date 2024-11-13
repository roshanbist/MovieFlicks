import fs from 'fs';

export const asyncErrorHandler = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    } finally {
      if (Array.isArray(req.files) && req.files.length > 0) {
        await Promise.all(
          req.files.map((file) => fs.promises.unlink(file.path))
        );
      }
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
    }
  };
};
