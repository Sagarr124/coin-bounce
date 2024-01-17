import { useState, useEffect } from "react";

import { getCrypto } from "../../api/external";
import Loader from "../../components/Loader/Loader";

import styles from "./Crypto.module.css";

const Crypto = () => {
    const [data, setData] = useState([]);
    const positiveStyle = {
        color: "16C784",
    };

    const negativeStyle = {
        color: "#EA3943",
    };

    useEffect(() => {
        (async function cryptoApiCall() {
            const response = await getCrypto();
            setData(response);
        })();

        setData([]);
    }, []);

    if (data.length === 0) {
        return <Loader text="Cryptocurrencies" />;
    }

    return (
        <table className={styles.table}>
            <thead className={styles.head}>
                <tr>
                    <th>#</th>
                    <th>Coin</th>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>24h Change</th>
                </tr>
            </thead>
            <tbody>
                {data.map((coin) => (
                    <tr key={coin.id} className={styles.tableRow}>
                        <td>{coin.market_cap_rank}</td>
                        <td>
                            <div className={styles.logo}>
                                <img
                                    src={coin.image}
                                    alt={coin.symbol}
                                    width={40}
                                    height={40}
                                />{" "}
                                {coin.name}
                            </div>
                        </td>
                        <td>
                            <div className={styles.symbol}>{coin.symbol}</div>
                        </td>
                        <td>{coin.current_price}</td>
                        <td
                            style={
                                coin.price_change_percentage_24h < 0
                                    ? negativeStyle
                                    : positiveStyle
                            }
                        >
                            {coin.price_change_percentage_24h}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Crypto;
