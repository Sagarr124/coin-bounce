const Joi = require("joi");
const fs = require("fs");

const Blog = require("../models/blog");
const Comment = require("../models/comment");
const BlogDTO = require("../dto/blog");
const BlogDetailsDTO = require("../dto/blog-details");
const { BACKEND_SERVER_PATH } = require("../config/index");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const blogController = {
    async createBlog(req, res, next) {
        const createBlogSchema = Joi.object({
            title: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            content: Joi.string().required(),
            photo: Joi.string().required(),
        });

        const { error } = createBlogSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { title, author, content, photo } = req.body;

        const buffer = Buffer.from(
            photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
            "base64"
        );

        const imagePath = `${Date.now()}-${author}.png`;

        try {
            fs.writeFileSync(`storage/${imagePath}`, buffer);
        } catch (error) {
            return next(error);
        }

        let newBlog;

        try {
            newBlog = new Blog({
                title,
                author,
                content,
                photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
            });

            await newBlog.save();
        } catch (error) {
            return next(error);
        }

        const blogDTO = new BlogDTO(newBlog);
        return res.status(201).json({ blog: blogDTO });
    },
    async getBlogs(req, res, next) {
        let blogs;

        try {
            blogs = await Blog.find();
        } catch (error) {
            return next(error);
        }

        const blogsDto = blogs.map((blog) => new BlogDTO(blog));
        return res.status(200).json({ blogs: blogsDto });
    },
    async getBlogById(req, res, next) {
        const getBlogByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required(),
        });

        const { error } = getBlogByIdSchema.validate(req.params);

        if (error) {
            return next(error);
        }

        let blog;
        const { id } = req.params;

        try {
            blog = await Blog.findOne({ _id: id }).populate("author");
        } catch (error) {
            return next(error);
        }

        if (!blog) {
            return next(new Error("Blog not found"));
        }

        const blogDetailsDto = new BlogDetailsDTO(blog);
        return res.status(200).json({ blog: blogDetailsDto });
    },
    async updateBlog(req, res, next) {
        const updateBlogSchema = Joi.object({
            blogId: Joi.string().regex(mongodbIdPattern).required(),
            title: Joi.string().required(),
            content: Joi.string().required(),
            photo: Joi.string(),
            author: Joi.string().regex(mongodbIdPattern).required(),
        });

        const { error } = updateBlogSchema.validate(req.body);

        const { blogId, title, content, photo, author } = req.body;

        let blog;

        try {
            blog = await Blog.findOne({ _id: blogId });
        } catch (error) {
            return next(error);
        }

        if (photo) {
            let previousPhotoPath = blog.photoPath;

            let previousPhoto = previousPhotoPath.split("/").at(-1);

            fs.unlinkSync(`storage/${previousPhoto}`);

            const buffer = Buffer.from(
                photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
                "base64"
            );

            const imagePath = `${Date.now()}-${author}.png`;

            try {
                fs.writeFileSync(`storage/${imagePath}`, buffer);
            } catch (error) {
                return next(error);
            }

            await Blog.updateOne(
                { _id: blogId },
                {
                    title,
                    content,
                    photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
                }
            );
        } else {
            await Blog.updateOne({ _id: blogId }, { title, content });
        }

        return res.status(200).json({ message: "Blog updated successfully" });
    },
    async deleteBlog(req, res, next) {
        const deleteBlogSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required(),
        });

        const { error } = deleteBlogSchema.validate(req.params);

        if (error) {
            return next(error);
        }

        const { id } = req.params;

        try {
            await Blog.deleteOne({ _id: id });

            await Comment.deleteMany({ blog: id });
        } catch (error) {}

        return res.status(200).json({ message: "Blog deleted successfully" });
    },
};

module.exports = blogController;
