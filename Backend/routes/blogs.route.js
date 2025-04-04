import express from "express";
const router = express.Router();
import { getBlogs, createBlog, updateBlog, deleteBlog } from "../controllers/blogs.controller.js";
import { isAuth } from "../middlewares/isAuth.middle.js";


router.get("/", getBlogs);
router.post("/",isAuth, createBlog);
router.put("/", isAuth, updateBlog);
router.delete("/", isAuth, deleteBlog);

export default router;