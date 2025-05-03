import { NextFunction, Request, Response } from "express";

const AsyncWrapper =
  (cb: CallableFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(cb(req, res, next)).catch(next);
  };

export default AsyncWrapper;
