import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { getBlogById, updateBlog } from "../../api/internal";
import TextInput from "../../components/TextInput/TextInput";

import styles from "./UpdateBlog.module.css";

const UpdateBlog = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const author = useSelector((state) => state.user._id);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState("");

    const getPhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => setPhoto(reader.result);
    };

    const handleUpdate = async () => {
        let data;

        if (photo.includes("http")) {
            data = {
                blogId: id,
                author,
                title,
                content,
            };
        } else {
            data = {
                blogId: id,
                author,
                title,
                content,
                photo,
            };
        }

        const response = await updateBlog(data);

        if (response.status === 200) {
            navigate("/blog");
        }
    };

    useEffect(() => {
        (async function getBlogDetails() {
            const response = await getBlogById(id);

            if (response === 200) {
                setTitle(response.data.blog.title);
                setContent(response.data.blog.content);
                setPhoto(response.data.blog.photo);
            }
        })();
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Edit your Blog</div>
            <TextInput
                type="text"
                name="title"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "60%" }}
            />
            <textarea
                maxLength={400}
                value={content}
                placeholder="content goes here!"
                className={styles.content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className={styles.photoPrompt}>
                <p>Choose a Photo</p>
                <input
                    type="file"
                    name="photo"
                    id="photo"
                    accept="image/jpg, image/jpeg, image/png"
                    onChange={getPhoto}
                />
                <img src={photo} alt="blog" width={100} height={100} />
            </div>
            <button className={styles.update} onClick={handleUpdate}>
                Update
            </button>
        </div>
    );
};

export default UpdateBlog;
