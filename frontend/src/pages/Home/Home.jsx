import { useState, useEffect } from "react";

import { getNews } from "../../api/external";
import Loader from "../../components/Loader/Loader";

import styles from "./Home.module.css";

const Home = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        (async function newsApiCall() {
            const response = await getNews();
            setArticles(response);
        })();

        setArticles([]);
    }, []);

    const handleCardClick = (url) => {
        window.open(url, "_blank");
    };

    if (articles.length === 0) {
        return <Loader text="News" />;
    }

    return (
        <>
            <div className={styles.header}>Latest Articles</div>
            <div className={styles.grid}>
                {articles.map((article) => (
                    <div
                        className={styles.card}
                        key={article.url}
                        onClick={() => handleCardClick(article.url)}
                    >
                        <img src={article.urlToImage} alt={article.title} />
                        <h3>{article.title}</h3>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Home;
