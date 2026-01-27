import { useEffect, useState } from "react";
import { apiFetch } from "../apiwallet/api.js";

export default function Dashboard() {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    apiFetch("/dashboard/wallet/").then(setWallet);
  }, []);

  if (!wallet) return <p>Loading...</p>;

  return (
    <div className="page">
      <h2>Dashboard</h2>
      <div className="card">
        <h3>Wallet Balance</h3>
        <p>₹ {wallet.balance}</p>
      </div>
    </div>
  );
}
