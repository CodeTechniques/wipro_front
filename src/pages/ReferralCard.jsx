import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import "../styles/referral.css";

import { useCurrency } from "../context/CurrencyContext";
import { formatPrice } from "../utils/currency";

export default function ReferralCard() {
  const { currency } = useCurrency();

  const [referralLink, setReferralLink] = useState("");
  const [period, setPeriod] = useState("weekly");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadLeaderboard(period);
  }, [period]);

  const loadLeaderboard = async (p) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/auth/referral-leaderboard/?period=${p}`);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiFetch("/auth/my-referral/").then((res) => {
      const link = `${window.location.origin}/register?ref=${res.referral_code}`;
      setReferralLink(link);
    });
  }, []);

  /* 🔹 COPY WITH ANIMATION */
  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* 🔹 SHARE */
  const shareNow = async () => {
    const text = `Join WIPO & earn rewards! 🚀\n\n${referralLink}`;

    if (navigator.share) {
      await navigator.share({
        title: "WIPO Refer & Earn",
        text,
        url: referralLink,
      });
      return;
    }

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <section className="refer-wrapper">
      {/* HEADER */}
      <div className="refer-header">
        <span className="partner-badge">🚀 WIPO PARTNER PROGRAM</span>
        <h1>Refer & Earn</h1>
        <p>Invite friends to WIPO and grow your wealth together with rewards.</p>
      </div>

      {/* MAIN GRID */}
      <div className="refer-grid">
        {/* LEFT CARD */}
        <div className="refer-card primary">
          <div className="refer-card-header">
            <div className="icon-box">
              <i className="bi bi-people"></i>
            </div>
            <div className="refer-title">
              <h3>Your Referral Code</h3>
              <span>Share and start earning rewards</span>
            </div>
          </div>

          <div className="refer-input-row">
            <input value={referralLink} readOnly />
            <button
              onClick={copyLink}
              className={`copy-btn ${copied ? "copied" : ""}`}
            >
              {copied ? "✓" : <i className="bi bi-clipboard"></i>}
            </button>
          </div>

          <button className="share-btn" onClick={shareNow}>
            <i className="bi bi-share"></i> Share Now
          </button>

          <div className="share-options">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(referralLink)}`}
              target="_blank"
            >
              <i className="bi bi-whatsapp"></i>
            </a>

            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(
                referralLink
              )}`}
              target="_blank"
            >
              <i className="bi bi-telegram"></i>
            </a>

            <a
              href={`mailto:?subject=WIPO Refer & Earn&body=${encodeURIComponent(
                referralLink
              )}`}
            >
              <i className="bi bi-envelope"></i>
            </a>
          </div>
        </div>

        {/* RIGHT CARD – REWARDS */}
        <div className="refer-card reward">
          <div className="refer-card-header">
            <div className="icon-box gold">
              <i className="bi bi-trophy"></i>
            </div>
            <h3>Rewards Program</h3>
          </div>

          <div className="reward-item">
            <span>Weekly Top</span>
            <strong>{formatPrice(5000, currency)}</strong>
          </div>

          <div className="reward-item">
            <span>Monthly Top</span>
            <strong>{formatPrice(50000, currency)}</strong>
          </div>

          <div className="reward-item">
            <span>Yearly Top</span>
            <strong>{formatPrice(1000000, currency)}</strong>
          </div>
        </div>
      </div>

      {/* LEADERBOARD */}
      <div className="leaderboard-card">
        <h2>🏆 Leaderboard</h2>
        <p className="sub">Top performers competing for prizes</p>

        <div className="leaderboard-tabs">
          {["weekly", "monthly", "yearly"].map((p) => (
            <button
              key={p}
              className={period === p ? "active" : ""}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="leaderboard-list">
            {data.map((item) => (
              <div className="leaderboard-row" key={item.rank}>
                <div className={`rank rank-${item.rank}`}>{item.rank}</div>

                <div className="leaderboard-user">
                  <div className="username">{item.name}</div>
                  <div className="referrals">
                    {item.referrals} referrals
                  </div>
                </div>

                <div className="leaderboard-amount">
                  {formatPrice(item.amount, currency)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
