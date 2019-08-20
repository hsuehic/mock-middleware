import { NextFunction, Request, Response } from 'express';

/**
 *
 * @param dir {string} the absolute path of mock data directory
 */
export default function(
  dir: string,
  apiPattern?: RegExp,
): (req: Request, res: Response, NextFunction) => void;
