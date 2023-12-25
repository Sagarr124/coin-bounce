const Joi = require("joi");

const Comment = require("../models/comment");
const CommentDTO = require("../dto/comment");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const commentController = {
    async createComment(req, res, next) {
        const createCommentSchema = Joi.object({
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            blog: Joi.string().regex(mongodbIdPattern).required(),
        });

        const { error } = createCommentSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { content, author, blog } = req.body;

        try {
            const newComment = await Comment({
                content,
                author,
                blog,
            });

            await newComment.save();
        } catch (err) {
            return next(err);
        }

        return res
            .status(201)
            .json({ message: "Comment created successfully" });
    },
    async getCommentsByBlogId(req, res, next) {
        const getCommentsByBlogIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required(),
        });

        const { error } = getCommentsByBlogIdSchema.validate(req.params);

        if (error) {
            return next(error);
        }

        const { id } = req.params;
        let comments;

        try {
            comments = await Comment.find({ blog: id }).populate("author");
        } catch (err) {
            return next(err);
        }

        const commentsDto = comments.map((comment) => new CommentDTO(comment));

        return res.status(200).json({ data: commentsDto });
    },
};

module.exports = commentController;
