import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';



const PlanPayment = () => {
  const { plan_id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const data = await getRequest(`${import.meta.env.VITE_PLANS_ENDPOINT}/${plan_id}/payable/`);
        setPlan(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [plan_id]);

  const handlePay = async () => {
    try {
      await postRequest(`${import.meta.env.VITE_PLANS_ENDPOINT}/${plan_id}/pay/`, {});
      alert('Payment successful! Redirecting...');
      navigate('/transactions');
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading payment details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!plan) return <div className="error">Plan not found</div>;

  return (
    <div className="payment-container">
      <h1>Pay for Investment Plan</h1>
      <div className="plan-details">
        <h3>{plan.name}</h3>
        <p><strong>Amount:</strong> ${plan.amount.toLocaleString()}</p>
        <p><strong>Duration:</strong> {plan.duration_months} months</p>
        <p><strong>Description:</strong> {plan.description}</p>
      </div>

      <button onClick={handlePay} className="btn btn-primary btn-large">
        Pay Now (${plan.amount.toLocaleString()})
      </button>
      <button onClick={() => navigate(-1)} className="btn btn-secondary">Back</button>
    </div>
  );
};

export default PlanPayment;
