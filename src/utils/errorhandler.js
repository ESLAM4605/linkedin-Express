export class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
export const CatchError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
