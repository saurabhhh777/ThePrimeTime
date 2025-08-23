import express from "express";
const router = express.Router();
import { 
    getUserProjects, 
    createProject, 
    updateProject, 
    deleteProject, 
    getProjectDetails 
} from "../controllers/projects.controller.js";
import { isAuth } from "../middlewares/isAuth.middle.js";

// All routes require authentication
router.use(isAuth);

// Get all projects for the authenticated user
router.get("/", getUserProjects);

// Create a new project
router.post("/", createProject);

// Get project details
router.get("/:id", getProjectDetails);

// Update a project
router.put("/:id", updateProject);

// Delete a project
router.delete("/:id", deleteProject);

export default router;
