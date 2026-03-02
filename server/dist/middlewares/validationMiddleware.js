"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = validateData;
const zod_1 = require("zod");
function validateData(schema, type = "BODY") {
    return (req, res, next) => {
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
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                console.error(error.errors);
                const errorMessages = error.errors.map((issue) => ({
                    path: `${issue.path.join(".")}`,
                    message: `${issue.message}`,
                }));
                res.status(400).json({
                    success: 0,
                    message: "Invalid data",
                });
            }
            else {
                res
                    .status(500)
                    .json({ success: 0, message: "Internal Server Error" });
            }
        }
    };
}
//# sourceMappingURL=validationMiddleware.js.map