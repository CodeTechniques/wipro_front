import { useState } from "react";
import { withdrawFromCommittee } from "../apiwallet/committee.js";

export default function WithdrawModal({ committeeId }) {
  const [amount, setAmount] = useState("");

  const submit = async () => {
    await withdrawFromCommittee(committeeId, amount);
    alert("Withdrawal successful");
    window.location.reload();
  };

  return (
    <div>
      <input
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={submit}>Withdraw</button>
    </div>
  );
}
