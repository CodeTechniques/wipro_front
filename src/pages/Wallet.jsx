import React, { useEffect, useState } from "react";
import "./Wallet.css";
import { apiFetch } from "../api/api";
import { Link } from "react-router-dom";

import { useCurrency } from "../context/CurrencyContext";
import { formatPrice } from "../utils/currency";

const Wallet = () => {
  const { currency } = useCurrency();

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  /* 🔹 Wallet summary */
  useEffect(() => {
    apiFetch("/me/")
      .then((res) => {
        setWallet(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* 🔹 Wallet transactions */
  useEffect(() => {
    apiFetch("/wallet-payments/")
      .then((res) => setTransactions(res))
      .catch(console.error);
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Loading wallet...</p>;
  if (!wallet) return <p style={{ padding: 40 }}>Failed to load wallet</p>;

  return (
    <div className="wallet-container">
      {/* HEADER */}
      <div className="wallet-header">
        <span className="security-badge">INSTITUTIONAL GRADE SECURITY</span>
        <h1>
          My <span>Vault.</span>
        </h1>
      </div>

      {/* PORTFOLIO */}
      <div className="portfolio-card">
        <div>
          <p className="label">GLOBAL PORTFOLIO VALUE</p>
          <h2>{formatPrice(wallet.net_balance, currency)}</h2>

          <div className="portfolio-meta">
            <span className="growth">LIVE CALCULATED</span>
            <span className="instant">INSTANT PAYOUTS</span>
          </div>
        </div>

        <div className="actions">
          <Link to="/pay">
  <button className="deposit-btn">＋ DEPOSIT</button>
</Link>
          <Link to="/withdraw">
  <button className="withdraw-btn">↙ WITHDRAW</button>
</Link>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>TOTAL DEPOSIT</p>
          <h3>{formatPrice(wallet.total_invested, currency)}</h3>
          <small>Total Investmest </small>
        </div>

        <div className="stat-card">
          <p>TOTAL WITHDRAW</p>
          <h3>{formatPrice(wallet.total_withdrawn, currency)}</h3>
          <small>Total Withdraw</small>
        </div>

        <div className="stat-card">
          <p>BONUS BALANCE</p>
          <h3 className="green">
            {formatPrice(wallet.bonus_balance, currency)}
          </h3>
          <small>Roi</small>
        </div>
      </div>

      {/* EARNED / PAID / NET */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>TOTAL EARNED</p>
          <h3 className="green">
            {formatPrice(wallet.total_earned, currency)}
          </h3>
          <small>Total Earning</small>
        </div>

        <div className="stat-card">
          <p>TOTAL PAID</p>
          <h3 className="red">
            {formatPrice(wallet.total_paid, currency)}
          </h3>
          <small>Amount you Spent</small>
        </div>

        <div className="stat-card highlight">
          <p>NET BALANCE</p>
          <h3>{formatPrice(wallet.net_balance, currency)}</h3>
          <small>Current Balance</small>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="transaction-box">
        <h4>ASSET TRANSACTION HISTORY</h4>

        {transactions.length === 0 && (
          <p style={{ padding: "10px 0", color: "#999" }}>
            No transactions found
          </p>
        )}

        {transactions.map((tx) => (
          <div className="transaction" key={tx.id}>
            <div>
              <small>{tx.created_at}</small>
              <p>{tx.payment_method}</p>
            </div>

            <span className={tx.tx_type === "earn" ? "credit" : "debit"}>
              {tx.tx_type === "earn" ? "+" : "-"}{" "}
              {formatPrice(tx.amount, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;