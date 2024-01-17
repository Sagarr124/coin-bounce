import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { submitBlog } from "../../api/internal";
import TextInput from "../../components/TextInput/TextInput";

import styles from "./SubmitBlog.module.css";

const SubmitBlog = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState("");

    const author = useSelector((state) => state.user._id);

    const getPhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => setPhoto(reader.result);
    };

    const handleSubmit = async () => {
        const data = {
            author,
            title,
            content,
            photo,
        };

        const response = await submitBlog(data);

        if (response.status === 201) {
            navigate("/");
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Create a Blog!</div>
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
                {photo && (
                    <img src={photo} alt="blog" width={100} height={100} />
                )}
            </div>
            <button
                className={styles.submit}
                onClick={handleSubmit}
                disabled={title === "" || content === "" || photo === ""}
            >
                Submit
            </button>
        </div>
    );
};

export default SubmitBlog;
