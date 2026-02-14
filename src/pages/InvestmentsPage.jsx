import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useCurrency } from "../context/CurrencyContext";
import { formatPrice } from "../utils/currency";

export default function InvestmentsPage() {
  const [goldPrice, setGoldPrice] = useState(null);
  const [goldProducts, setGoldProducts] = useState([]);
  const [bondProducts, setBondProducts] = useState([]);
  const [myGold, setMyGold] = useState([]);
  const [myBonds, setMyBonds] = useState([]);
  const [loading, setLoading] = useState(true);

  // modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [investType, setInvestType] = useState(null); // 'gold' or 'bond'
  const [withdrawItem, setWithdrawItem] = useState(null);

  const { currency } = useCurrency();

  const fetchAll = async () => {
    try {
      const [priceRes, goldProdRes, bondProdRes, myInvRes] = await Promise.all([
        apiFetch("/investments/gold-price/"),
        apiFetch("/investments/gold/products/"),
        apiFetch("/investments/bond/products/"),
        apiFetch("/investments/my-investments/"),
      ]);
      setGoldPrice(priceRes);
      setGoldProducts(goldProdRes);
      setBondProducts(bondProdRes);
      setMyGold(myInvRes.gold_investments || []);
      setMyBonds(myInvRes.bond_investments || []);
    } catch (error) {
      console.error("Failed to fetch investment data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleInvest = async (productId, amount) => {
    const endpoint =
      investType === "gold"
        ? "/investments/gold/invest/"
        : "/investments/bond/invest/";
    const payload = { product_id: productId, amount };

    try {
      const response = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (response.success) {
        await fetchAll();
        setSelectedProduct(null);
        alert("Investment successful!");
      } else if (response.error) {
        alert(response.error);
      }
    } catch {
      alert("Investment failed. Please try again.");
    }
  };

  const handleWithdraw = async (item, type) => {
    const endpoint =
      type === "gold"
        ? "/investments/gold/withdraw/"
        : "/investments/bond/withdraw/";
    const payload =
      type === "gold" ? { investment_id: item.id } : { bond_id: item.id };

    try {
      const response = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (response.success) {
        await fetchAll();
        setWithdrawItem(null);
        alert(
          `Withdrawn ${formatPrice(response.credited_amount, currency)} successfully!`
        );
      } else if (response.error) {
        alert(response.error);
      }
    } catch {
      alert("Withdrawal failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading investments...</p>
      </div>
    );
  }

  return (
    <div className="investments-page">
      <div className="container">
        <h1 className="page-title">Gold & Bond Investments</h1>

        {/* Gold price banner */}
        {goldPrice && (
          <div className="gold-price-banner">
            <div className="banner-content">
              <span className="banner-label">Today's Gold Price:</span>
              <strong className="price-value">
                {formatPrice(goldPrice.price_per_gram, goldPrice.currency)} 
                <span className="price-unit">/gram</span>
              </strong>
              <span className="updated-at">
                Updated: {new Date(goldPrice.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* My Gold Holdings */}
        <section className="investments-section">
          <div className="section-header">
            <h2>Your Gold Holdings</h2>
            {myGold.length > 0 && (
              <span className="item-count">{myGold.length} investments</span>
            )}
          </div>
          
          {myGold.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <p className="empty-message">No gold investments yet.</p>
              <p className="empty-submessage">Start investing in gold today!</p>
            </div>
          ) : (
            <div className="investments-grid">
              {myGold.map((g) => (
                <div key={g.id} className="investment-card gold-card">
                  <div className="card-badge">Gold</div>
                  <div className="investment-header">
                    <span className="invested-amount">
                      Invested: {formatPrice(g.invested_amount, currency)}
                    </span>
                    <span
                      className={`profit-badge ${
                        g.profit_or_loss >= 0 ? "positive" : "negative"
                      }`}
                    >
                      {g.profit_or_loss >= 0 ? "+" : ""}
                      {formatPrice(g.profit_or_loss, currency)}
                    </span>
                  </div>
                  <div className="investment-details">
                    <div className="detail-row">
                      <span>Grams:</span>
                      <strong>{g.grams.toFixed(4)} g</strong>
                    </div>
                    <div className="detail-row">
                      <span>Buy Price:</span>
                      <strong>{formatPrice(g.buy_price_per_gram, currency)}/g</strong>
                    </div>
                    <div className="detail-row">
                      <span>Current Price:</span>
                      <strong className="current-price">
                        {formatPrice(g.current_price_per_gram, currency)}/g
                      </strong>
                    </div>
                    <div className="detail-row highlight">
                      <span>Current Value:</span>
                      <strong>{formatPrice(g.current_value, currency)}</strong>
                    </div>
                    <div className="investment-date">
                      Purchased: {new Date(g.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    className="withdraw-btn"
                    onClick={() => setWithdrawItem({ item: g, type: "gold" })}
                  >
                    Withdraw Gold
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Gold Products */}
        <section className="products-section">
          <div className="section-header">
            <h2>Available Gold Plans</h2>
          </div>
          
          {goldProducts.length === 0 ? (
            <div className="empty-state">
              <p className="empty-message">No gold products available.</p>
            </div>
          ) : (
            <div className="products-grid">
              {goldProducts.map((p) => (
                <div key={p.id} className="product-card gold-product">
                  <div className="product-icon">✨</div>
                  <h3>{p.name}</h3>
                  {p.description && (
                    <p className="product-description">{p.description}</p>
                  )}
                  <div className="product-limits">
                    <div className="limit-item">
                      <span className="limit-label">Minimum</span>
                      <span className="limit-value">{formatPrice(p.minimum_amount, currency)}</span>
                    </div>
                    <div className="limit-divider"></div>
                    <div className="limit-item">
                      <span className="limit-label">Maximum</span>
                      <span className="limit-value">{formatPrice(p.maximum_amount, currency)}</span>
                    </div>
                  </div>
                  <button
                    className="invest-btn gold-btn"
                    onClick={() => {
                      setInvestType("gold");
                      setSelectedProduct(p);
                    }}
                  >
                    Invest in Gold
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Bond Investments */}
        <section className="investments-section">
          <div className="section-header">
            <h2>Your Bond Investments</h2>
            {myBonds.length > 0 && (
              <span className="item-count">{myBonds.length} investments</span>
            )}
          </div>
          
          {myBonds.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p className="empty-message">No bond investments yet.</p>
              <p className="empty-submessage">Explore our bond options!</p>
            </div>
          ) : (
            <div className="investments-grid">
              {myBonds.map((b) => (
                <div key={b.id} className="investment-card bond-card">
                  <div className="card-badge bond">Bond</div>
                  <div className="investment-header">
                    <span className="invested-amount">
                      Invested: {formatPrice(b.invested_amount, currency)}
                    </span>
                    <span
                      className={`maturity-badge ${
                        b.is_matured ? "matured" : "pending"
                      }`}
                    >
                      {b.is_matured ? "Matured" : "Active"}
                    </span>
                  </div>
                  <div className="investment-details">
                    <div className="detail-row">
                      <span>ROI:</span>
                      <strong className="roi-value">{b.roi_percent}%</strong>
                    </div>
                    <div className="detail-row">
                      <span>Maturity:</span>
                      <strong>{new Date(b.maturity_date).toLocaleDateString()}</strong>
                    </div>
                    <div className="detail-row highlight">
                      <span>Maturity Amount:</span>
                      <strong>{formatPrice(b.maturity_amount, currency)}</strong>
                    </div>
                    <div className="investment-date">
                      Purchased: {new Date(b.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {b.is_matured && (
                    <button
                      className="withdraw-btn"
                      onClick={() => setWithdrawItem({ item: b, type: "bond" })}
                    >
                      Withdraw Bond
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bond Products */}
        <section className="products-section">
          <div className="section-header">
            <h2>Available Bonds</h2>
          </div>
          
          {bondProducts.length === 0 ? (
            <div className="empty-state">
              <p className="empty-message">No bond products available.</p>
            </div>
          ) : (
            <div className="products-grid">
              {bondProducts.map((p) => (
                <div key={p.id} className="product-card bond-product">
                  <div className="product-icon">📈</div>
                  <h3>{p.name}</h3>
                  {p.description && (
                    <p className="product-description">{p.description}</p>
                  )}
                  <div className="bond-details">
                    <div className="bond-detail-item">
                      <span className="bond-detail-label">ROI</span>
                      <span className="bond-detail-value">{p.roi_percent}%</span>
                    </div>
                    <div className="bond-detail-item">
                      <span className="bond-detail-label">Duration</span>
                      <span className="bond-detail-value">{p.duration_months}m</span>
                    </div>
                  </div>
                  <div className="product-limits">
                    <div className="limit-item">
                      <span className="limit-label">Minimum</span>
                      <span className="limit-value">{formatPrice(p.minimum_amount, currency)}</span>
                    </div>
                    <div className="limit-divider"></div>
                    <div className="limit-item">
                      <span className="limit-label">Maximum</span>
                      <span className="limit-value">{formatPrice(p.maximum_amount, currency)}</span>
                    </div>
                  </div>
                  <button
                    className="invest-btn bond-btn"
                    onClick={() => {
                      setInvestType("bond");
                      setSelectedProduct(p);
                    }}
                  >
                    Invest in Bond
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Invest Modal */}
      {selectedProduct && (
        <InvestModal
          product={selectedProduct}
          type={investType}
          onClose={() => setSelectedProduct(null)}
          onInvest={handleInvest}
          currency={currency}
        />
      )}

      {/* Withdraw Confirmation Modal */}
      {withdrawItem && (
        <WithdrawModal
          item={withdrawItem.item}
          type={withdrawItem.type}
          onClose={() => setWithdrawItem(null)}
          onConfirm={handleWithdraw}
          currency={currency}
        />
      )}
    </div>
  );
}

// Invest Modal Component
function InvestModal({ product, type, onClose, onInvest, currency }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const min = product.minimum_amount;
  const max = product.maximum_amount;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num < min || num > max) {
      setError(
        `Amount must be between ${formatPrice(min, currency)} and ${formatPrice(
          max,
          currency
        )}`
      );
      return;
    }
    onInvest(product.id, num);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-icon">{type === "gold" ? "✨" : "📈"}</div>
        <h2>Invest in {product.name}</h2>
        <p className="modal-type">
          {type === "gold" ? "Gold Investment" : "Bond Investment"}
        </p>
        {product.description && (
          <p className="modal-description">{product.description}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Investment Amount ({currency})</label>
            <input
              type="number"
              step="0.01"
              min={min}
              max={max}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder={`Enter amount`}
            />
            <div className="limits-hint">
              <span>Min: {formatPrice(min, currency)}</span>
              <span>Max: {formatPrice(max, currency)}</span>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="confirm-btn">
            Confirm Investment
          </button>
        </form>
      </div>
    </div>
  );
}

// Withdraw Modal Component
function WithdrawModal({ item, type, onClose, onConfirm, currency }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card withdraw-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-icon warning">⚠️</div>
        <h2>Confirm Withdrawal</h2>
        <p className="withdraw-message">
          Are you sure you want to withdraw this {type} investment?
        </p>
        {type === "gold" && (
          <div className="withdraw-details">
            <p>Amount: {formatPrice(item.current_value, currency)}</p>
            <p>Grams: {item.grams.toFixed(4)} g</p>
          </div>
        )}
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="confirm-btn withdraw"
            onClick={() => onConfirm(item, type)}
          >
            Confirm Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = `
.investments-page {
  background: linear-gradient(135deg, #f6faf7 0%, #f0f7f0 100%);
  min-height: 100vh;
  padding: 24px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #e6f7e6;
  border-top: 3px solid #22c55e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Gold price banner */
.gold-price-banner {
  background: linear-gradient(135deg, #e6f7e6 0%, #d4f0d4 100%);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 40px;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.banner-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
}

.banner-label {
  font-size: 16px;
  color: #2d3a3a;
  font-weight: 500;
}

.price-value {
  font-size: 36px;
  color: #16a34a;
  font-weight: 700;
  line-height: 1;
}

.price-unit {
  font-size: 18px;
  font-weight: 400;
  color: #4b7b5e;
  margin-left: 4px;
}

.updated-at {
  font-size: 14px;
  color: #64748b;
  background: rgba(255,255,255,0.5);
  padding: 6px 12px;
  border-radius: 30px;
  margin-left: auto;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  position: relative;
  padding-left: 16px;
}

.section-header h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 30px;
  background: #22c55e;
  border-radius: 3px;
}

.item-count {
  background: #e6f7e6;
  color: #16a34a;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  border: 1px solid #eaf5ea;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-message {
  font-size: 18px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 500;
}

.empty-submessage {
  font-size: 14px;
  color: #94a3b8;
}

/* Grids */
.investments-section,
.products-section {
  margin-bottom: 48px;
}

.investments-grid,
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* Investment Cards */
.investment-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  border: 1px solid #eaf5ea;
  position: relative;
  display: flex;
  flex-direction: column;
}

.investment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
}

.card-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f0f7f0;
  color: #16a34a;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-badge.bond {
  background: #e6f0ff;
  color: #2563eb;
}

.investment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-right: 60px;
}

.invested-amount {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.profit-badge {
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
}

.profit-badge.positive {
  background: #e6f7e6;
  color: #16a34a;
}

.profit-badge.negative {
  background: #fee9e9;
  color: #dc2626;
}

.maturity-badge {
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
}

.maturity-badge.matured {
  background: #e6f7e6;
  color: #16a34a;
}

.maturity-badge.pending {
  background: #fff3e0;
  color: #f97316;
}

.investment-details {
  background: #f9fbf9;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 20px;
  flex: 1;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #e2f0e2;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row span {
  color: #64748b;
  font-size: 14px;
}

.detail-row strong {
  color: #1e293b;
  font-size: 15px;
  font-weight: 600;
}

.detail-row .current-price {
  color: #16a34a;
}

.detail-row .roi-value {
  color: #2563eb;
}

.detail-row.highlight {
  background: #e6f7e6;
  margin: 8px -8px 0;
  padding: 12px 8px;
  border-radius: 12px;
  border: none;
}

.detail-row.highlight strong {
  color: #16a34a;
  font-size: 16px;
}

.investment-date {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 12px;
  text-align: right;
  font-style: italic;
}

/* Product Cards */
.product-card {
  background: white;
  border-radius: 24px;
  padding: 28px 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  border: 1px solid #eaf5ea;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px rgba(34, 197, 94, 0.1);
}

.product-card.gold-product:hover {
  border-color: #fbbf24;
}

.product-card.bond-product:hover {
  border-color: #2563eb;
}

.product-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.product-card h3 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.product-description {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.6;
  flex: 1;
}

.product-limits {
  background: #f0faf0;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.limit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.limit-label {
  font-size: 12px;
  color: #6b8a7a;
  margin-bottom: 4px;
}

.limit-value {
  font-size: 16px;
  font-weight: 600;
  color: #16a34a;
}

.limit-divider {
  width: 1px;
  height: 30px;
  background: #d4e8d4;
  margin: 0 12px;
}

.bond-details {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.bond-detail-item {
  flex: 1;
  background: #f0f7ff;
  border-radius: 16px;
  padding: 12px;
  text-align: center;
}

.bond-detail-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.bond-detail-value {
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
}

/* Buttons */
.invest-btn {
  border: none;
  padding: 16px 24px;
  border-radius: 18px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
}

.invest-btn.gold-btn {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
}

.invest-btn.gold-btn:hover {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  transform: scale(1.02);
}

.invest-btn.bond-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.invest-btn.bond-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: scale(1.02);
}

.withdraw-btn {
  background: transparent;
  border: 2px solid #16a34a;
  color: #16a34a;
  padding: 12px 20px;
  border-radius: 18px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 8px;
}

.withdraw-btn:hover {
  background: #16a34a;
  color: white;
  transform: scale(1.02);
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 30, 10, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background: white;
  width: 460px;
  max-width: 100%;
  border-radius: 32px;
  padding: 36px 32px;
  position: relative;
  box-shadow: 0 30px 60px rgba(0, 50, 20, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 24px;
  border: none;
  background: transparent;
  font-size: 32px;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s;
  line-height: 1;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  color: #1e293b;
  background: #f1f5f9;
  transform: rotate(90deg);
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
  text-align: center;
}

.modal-icon.warning {
  color: #f97316;
}

.modal-card h2 {
  font-size: 26px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  text-align: center;
}

.modal-type {
  font-size: 15px;
  color: #64748b;
  text-align: center;
  margin-bottom: 24px;
}

.modal-description {
  font-size: 14px;
  background: #f0faf0;
  padding: 16px 20px;
  border-radius: 20px;
  margin-bottom: 28px;
  color: #2d4d3a;
  line-height: 1.6;
  text-align: center;
}

.input-group {
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  font-size: 15px;
  margin-bottom: 10px;
  color: #374151;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  font-size: 16px;
  transition: all 0.2s;
  background: #f8faf8;
}

.input-group input:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
  background: white;
}

.limits-hint {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6b8a7a;
  margin-top: 10px;
  font-weight: 500;
}

.error-message {
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 20px;
  background: #fee9e9;
  padding: 14px 18px;
  border-radius: 16px;
  text-align: center;
}

.confirm-btn {
  width: 100%;
  padding: 18px;
  border-radius: 24px;
  border: none;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
}

.confirm-btn.withdraw {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.confirm-btn.withdraw:hover {
  box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
}

/* Withdraw Modal Specific */
.withdraw-modal h2 {
  margin-bottom: 16px;
}

.withdraw-message {
  text-align: center;
  color: #475569;
  margin-bottom: 24px;
  font-size: 16px;
}

.withdraw-details {
  background: #f8faf8;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 28px;
}

.withdraw-details p {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #1e293b;
  font-weight: 500;
}

.withdraw-details p:last-child {
  margin-bottom: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  flex: 1;
  padding: 18px;
  border-radius: 24px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .page-title {
    font-size: 28px;
  }

  .banner-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .price-value {
    font-size: 28px;
  }

  .updated-at {
    margin-left: 0;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .investments-grid,
  .products-grid {
    grid-template-columns: 1fr;
  }

  .modal-card {
    padding: 28px 20px;
  }
}

@media (max-width: 480px) {
  .investment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .product-limits {
    flex-direction: column;
    gap: 12px;
  }

  .limit-divider {
    width: 100%;
    height: 1px;
    margin: 8px 0;
  }

  .bond-details {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.investments-page {
  animation: fadeIn 0.5s ease;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}