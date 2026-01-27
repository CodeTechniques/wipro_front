
import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

export default function MyTransactions() {
  const [tx, setTx] = useState([]);

  useEffect(() => {
    apiFetch("/properties/transactions/my/")
      .then(setTx)
      .catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2>My Transactions</h2>
      {tx.map((t) => (
        <div key={t.id} className="card">
          <p>Amount: ₹{t.amount}</p>
          <p>Status: {t.status}</p>
        </div>
      ))}
    </div>
  );
}
