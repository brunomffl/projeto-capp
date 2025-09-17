import { Router } from "express";
import { validateBody, validateParams } from "@/middleware/ValidateSchema";
import { OficinaControllers } from "@/controllers/oficinas-controller";
import { createOficinaSchema, deleteOficinaSchema, updateOficinaSchema } from "@/schemas/oficina-schema";

const oficinaRoutes = Router();
const oficinaControllers = new OficinaControllers();

oficinaRoutes.get("/", 
    oficinaControllers.index.bind(oficinaControllers)
);

oficinaRoutes.post("/",
    validateBody(createOficinaSchema),
    oficinaControllers.create.bind(oficinaControllers)
);

oficinaRoutes.put("/:id", 
    validateParams(deleteOficinaSchema), 
    validateBody(updateOficinaSchema), 
    oficinaControllers.update.bind(oficinaControllers)
);

oficinaRoutes.delete("/:id", 
    validateParams(deleteOficinaSchema), 
    oficinaControllers.delete.bind(oficinaControllers)
);

export { oficinaRoutes };