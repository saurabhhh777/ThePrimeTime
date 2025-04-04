import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getBlogs = async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany();
        res.status(200).json({
            message: "Blogs fetched successfully",
            success: true,
            blogs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const blog = await prisma.blog.create({
            data: {
                title,
                content,
                userId: req.user._id,
            },
        });
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateBlog = async (req, res) => {
    try {
        const { id, title, content } = req.body;
        const blog = await prisma.blog.update({
            where: { id },
            data: {
                title,
                content,
            },
        });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await prisma.blog.delete({
            where: { id },
        });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}