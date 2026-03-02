import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function validateData(
  schema: z.ZodObject<any, any>,
  type: "BODY" | "QUERY" = "BODY"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      switch (type) {
        case "BODY":
          schema.parse(req.body);
          next();
          break;
        case "QUERY":
          schema.parse(req.query);
          next();
          break;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(error.errors);

        const errorMessages = error.errors.map((issue: any) => ({
          path: `${issue.path.join(".")}`,
          message: `${issue.message}`,
        }));
        res.status(400).json({
          success: 0,
          message: "Invalid data",
        });
      } else {
        res
          .status(500)
          .json({ success: 0, message: "Internal Server Error" });
      }
    }
  };
}
