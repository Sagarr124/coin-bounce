import { Link } from "react-router-dom";

import styles from "./Error.module.css";

const Error = () => {
    return (
        <div className={styles.errorWrapper}>
            <h1 className={styles.errorHeader}>404</h1>
            <h2 className={styles.errorHeader}>Page not found</h2>
            <p className={styles.errorBody}>
                The page you are looking for might have been removed, had its
                name changed or is temporarily unavailable.
            </p>
            <Link to="/" className={styles.homeLink}>
                Back to homepage
            </Link>
        </div>
    );
};

export default Error;
