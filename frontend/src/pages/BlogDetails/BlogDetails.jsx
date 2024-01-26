import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import {
    getBlogById,
    getCommentsByBlogId,
    createComment,
    deleteBlog,
} from "../../api/internal";
import Loader from "../../components/Loader/Loader";
import CommentList from "../../components/CommentList/CommentList";

import styles from "./BlogDetails.module.css";

const BlogDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [blog, setBlog] = useState([]);
    const [comments, setComments] = useState([]);
    const [ownsBlog, setOwnsBlog] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [reload, setReload] = useState(false);

    const user = useSelector((state) => state.user);

    useEffect(() => {
        (async function getBlogDetails() {
            const commentsResponse = await getCommentsByBlogId(id);

            if (commentsResponse.status === 200) {
                setComments(commentsResponse.data.data);
            }

            const blogResponse = await getBlogById(id);

            if (blogResponse.status === 200) {
                setOwnsBlog(
                    user.username === blogResponse.data.blog.authorUsername
                );

                setBlog(blogResponse.data.blog);
            }
        })();
    }, [reload]);

    const handleDeleteBlog = async () => {
        const response = await deleteBlog(id);

        if (response.status === 200) {
            navigate("/blogs");
        }
    };

    const handlePostComment = async () => {
        const data = {
            author: user._id,
            blog: id,
            content: newComment,
        };

        const response = await createComment(data);

        if (response.status === 201) {
            setNewComment("");
            setReload(!reload);
        }
    };

    if (blog.length === 0) {
        return <Loader text="Blog Details" />;
    }

    return (
        <div className={styles.blogDetailsWrapper}>
            <div className={styles.left}>
                <h1 className={styles.title}>{blog.title}</h1>
                <div className={styles.meta}>
                    <p>
                        @
                        {blog.authorUsername +
                            " on " +
                            new Date(blog.createdAt).toDateString()}
                    </p>
                </div>
                <div className={styles.photo}>
                    <img src={blog.photo} alt="blog" width={250} height={250} />
                </div>
                <p className={styles.content}>{blog.content}</p>
                {ownsBlog && (
                    <div className={styles.controls}>
                        <button
                            className={styles.editButton}
                            onClick={() => navigate(`/blog-update/${blog._id}`)}
                        >
                            Edit
                        </button>
                        <button
                            className={styles.deleteButton}
                            onClick={handleDeleteBlog}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
            <div className={styles.right}>
                <div className={styles.commentsWrapper}>
                    <CommentList comments={comments} />
                    <div className={styles.postComment}>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="comment goes here..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                            className={styles.postCommentButton}
                            onClick={handlePostComment}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
