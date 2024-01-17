import * as yup from "yup";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const errorMessage = {
    "Use a strong password":
        "Password must contain at least 8 characters, one lowercase, one uppercase and one number",
};

const loginSchema = yup.object().shape({
    username: yup.string().min(5).max(30).required("Username is required"),
    password: yup
        .string()
        .min(8)
        .max(25)
        .matches(passwordPattern, { message: errorMessage })
        .required("Password is required"),
});

export default loginSchema;
