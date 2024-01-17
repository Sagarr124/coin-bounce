import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../api/internal";
import { resetUser } from "../../store/userSlice";

import styles from "./Navbar.module.css";

const Navbar = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.user.auth);

    const handleLogout = async () => {
        await logout();
        dispatch(resetUser());
    };

    return (
        <>
            <nav className={styles.navbar}>
                <NavLink
                    to="/"
                    className={`${styles.logo} ${styles.inActiveStyle}`}
                >
                    CoinBounce
                </NavLink>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? styles.activeStyle : styles.inActiveStyle
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="crypto"
                    className={({ isActive }) =>
                        isActive ? styles.activeStyle : styles.inActiveStyle
                    }
                >
                    Cryptocurrencies
                </NavLink>
                <NavLink
                    to="blogs"
                    className={({ isActive }) =>
                        isActive ? styles.activeStyle : styles.inActiveStyle
                    }
                >
                    Blogs
                </NavLink>
                <NavLink
                    to="submit"
                    className={({ isActive }) =>
                        isActive ? styles.activeStyle : styles.inActiveStyle
                    }
                >
                    Submit a blog
                </NavLink>
                {isAuthenticated ? (
                    <NavLink>
                        <button
                            className={styles.logOutButton}
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </NavLink>
                ) : (
                    <>
                        {" "}
                        <NavLink
                            to="login"
                            className={({ isActive }) =>
                                isActive
                                    ? styles.activeStyle
                                    : styles.inActiveStyle
                            }
                        >
                            <button className={styles.logInButton}>
                                Log In
                            </button>
                        </NavLink>
                        <NavLink
                            to="signup"
                            className={({ isActive }) =>
                                isActive
                                    ? styles.activeStyle
                                    : styles.inActiveStyle
                            }
                        >
                            <button className={styles.signUpButton}>
                                Sign Up
                            </button>
                        </NavLink>
                    </>
                )}
            </nav>
            <div className={styles.separator}></div>
        </>
    );
};

export default Navbar;
