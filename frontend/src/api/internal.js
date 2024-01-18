import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_INTERNAL_API_PATH,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const login = async (data) => {
    let response;

    try {
        response = await api.post("/login", data);
    } catch (error) {
        return error;
    }

    return response;
};

export const logout = async () => {
    let response;

    try {
        response = await api.get("/logout");
    } catch (error) {
        return error;
    }

    return response;
};

export const signup = async (data) => {
    let response;

    try {
        response = await api.post("/signup", data);
    } catch (error) {
        return error;
    }

    return response;
};

export const getAllBlogs = async () => {
    let response;

    try {
        response = await api.get("/blogs");
    } catch (error) {
        return error;
    }

    return response;
};

export const submitBlog = async (data) => {
    let response;

    try {
        response = await api.post("/blog", data);
    } catch (error) {
        return error;
    }

    return response;
};

export const getBlogById = async (id) => {
    let response;

    try {
        response = await api.get(`/blog/${id}`);
    } catch (error) {
        return error;
    }

    return response;
};

export const getCommentsByBlogId = async (id) => {
    let response;

    try {
        response = await api.get(`/comment/${id}`, { validateStatus: false });
    } catch (error) {
        return error;
    }

    return response;
};

export const createComment = async (data) => {
    let response;

    try {
        response = await api.post("/comment", data);
    } catch (error) {
        return error;
    }

    return response;
};

export const deleteBlog = async (id) => {
    let response;

    try {
        response = await api.delete(`/blog/${id}`);
    } catch (error) {
        return error;
    }

    return response;
};

export const updateBlog = async (data) => {
    let response;

    try {
        response = await api.put("/blog", data);
    } catch (error) {
        return error;
    }

    return response;
};

api.interceptors.response.use(
    (config) => config,
    async (error) => {
        const originalRequest = error.config;

        if (
            (error.response.status === 401 || error.response.status === 500) &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const response = await api.get(
                    `${process.env.REACT_APP_INTERNAL_API_PATH}/refresh`,
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    return api.request(originalRequest);
                }
            } catch (error) {
                return error;
            }
        }
    }
);
