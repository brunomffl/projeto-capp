import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

type ValidationTarget = "body" | "params" | "query";

function validate(schema: z.ZodSchema, target: ValidationTarget = "body") {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            let dataToValidate;

            switch (target){
                case "body":
                    dataToValidate = req.body;
                    break;
                case "params":
                    dataToValidate = req.params;
                    break;
                case "query":
                    dataToValidate = req.query;
                    break;
                default:
                    dataToValidate = req.body;
            }

            const result = schema.parse(dataToValidate);

            switch (target){
                case "body":
                    req.body = result;
                    break;
                case "params":
                    req.params = result as ParamsDictionary;
                    break;
                case "query":
                    req.query = result as ParsedQs;
                    break;
                default:
                    req.body = result;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export const validateBody = (schema: z.ZodSchema) => validate(schema, "body");
export const validateParams = (schema: z.ZodSchema) => validate(schema, "params");
export const validateQuery = (schema: z.ZodSchema) => validate(schema, "query");

