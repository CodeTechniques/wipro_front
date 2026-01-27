import { useState } from "react";
import { investInCommittee } from "../apiwallet/committee.js";

export default function InvestModal({ committeeId }) {
  const [amount, setAmount] = useState("");

  const submit = async () => {
    await investInCommittee(committeeId, amount);
    alert("Investment successful");
    window.location.reload();
  };

  return (
    <div>
      <input
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={submit}>Invest</button>
    </div>
  );
}
