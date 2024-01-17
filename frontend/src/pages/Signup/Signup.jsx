import { useState } from "react";
import { useFormik } from "formik";
import { signup } from "../../api/internal";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import TextInput from "../../components/TextInput/TextInput";
import signupSchema from "../../schemas/signupSchema";

import styles from "./Signup.module.css";

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [error, setError] = useState("");

    const handleSignup = async () => {
        const data = {
            name: values.name,
            username: values.username,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
        };

        const response = await signup(data);

        if (response.status === 200) {
            const user = {
                _id: response.data.user._id,
                email: response.data.user.email,
                username: response.data.user.username,
                auth: response.data.auth,
            };

            dispatch(setUser(user));

            navigate("/");
        } else if (response.code === "ERR_BAD_REQUEST") {
            setError(response.response.data.message);
        }
    };

    const { values, touched, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: signupSchema,
    });

    return (
        <div className={styles.signupWrapper}>
            <div className={styles.signupHeader}>Create an account</div>
            <TextInput
                type="text"
                name="name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="name"
                error={errors.name && touched.name ? 1 : undefined}
                errorMessage={errors.name}
            />
            <TextInput
                type="text"
                name="username"
                value={values.username}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="username"
                error={errors.username && touched.username ? 1 : undefined}
                errorMessage={errors.username}
            />
            <TextInput
                type="text"
                name="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="email"
                error={errors.email && touched.email ? 1 : undefined}
                errorMessage={errors.email}
            />
            <TextInput
                type="password"
                name="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="password"
                error={errors.password && touched.password ? 1 : undefined}
                errorMessage={errors.password}
            />
            <TextInput
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="confirm password"
                error={
                    errors.confirmPassword && touched.confirmPassword
                        ? 1
                        : undefined
                }
                errorMessage={errors.confirmPassword}
            />
            <button
                className={styles.signupButton}
                disabled={
                    !values.name ||
                    !values.username ||
                    !values.email ||
                    !values.password ||
                    !values.confirmPassword ||
                    errors.name ||
                    errors.username ||
                    errors.email ||
                    errors.password ||
                    errors.confirmPassword
                }
                onClick={handleSignup}
            >
                Sign Up
            </button>
            <span>
                Already have an account?{" "}
                <button
                    className={styles.loginButton}
                    onClick={() => navigate("/login")}
                >
                    Login Now!
                </button>
            </span>
            {error !== "" ? <p className={styles.errorMessage}>{error}</p> : ""}
        </div>
    );
};

export default Signup;
