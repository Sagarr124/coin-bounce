import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { setUser } from "../store/userSlice";

import axios from "axios";

const useAutoLogin = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function autoLoginApiCall() {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_INTERNAL_API_PATH}/refresh`,
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    const user = {
                        _id: response.data.user._id,
                        email: response.data.user.email,
                        username: response.data.user.username,
                        auth: response.data.auth,
                    };

                    dispatch(setUser(user));
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return loading;
};

export default useAutoLogin;
