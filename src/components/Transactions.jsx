import React, { useEffect, useState } from 'react';



const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getRequest(`${import.meta.env.VITE_PROPERTIES_ENDPOINT}/transactions/my/`);
        setTransactions(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="transactions-container">
      <h1>My Transactions</h1>

      {transactions.length === 0 ? (
        <p className="no-data">No transactions recorded.</p>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.property_title}</td>
                <td>${tx.amount.toLocaleString()}</td>
                <td>{tx.transaction_type}</td>
                <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                <td><span className={`status ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
