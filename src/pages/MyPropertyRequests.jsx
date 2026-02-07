import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import MiniVerticalNav from "../components/MiniVerticalNav";

export default function MyPropertyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    apiFetch("/properties/property-requests/my/")
      .then(res => {
        setRequests(res.results || res);
      })
      .catch(err => {
        console.error(err);
        setRequests([]);
      });
  }, []);

  return (
    <>
      <div className="page">
        {/* <div className="market-sidebar">
          <MiniVerticalNav />
        </div> */}

        <div className="content">
          <h2 className="page-title">My Property Requests</h2>

          {requests.length === 0 && (
            <p className="no-requests">No requests found.</p>
          )}

          <div className="requests-grid">
            {Array.isArray(requests) &&
              requests.map(req => (
                <div key={req.id} className="card">
                  <h4 className="property-title">{req.property_title}</h4>
                  <p className="status-text">
                    Status: <b className={`status-badge ${req.status}`}>{req.status.toUpperCase()}</b>
                  </p>

                  {req.status === "pending" && (
                    <p className="status-message pending">⏳ Waiting for owner approval</p>
                  )}
                  {req.status === "approved" && (
                    <p className="status-message approved">✅ Approved – owner will contact you</p>
                  )}
                  {req.status === "rejected" && (
                    <p className="status-message rejected">❌ Rejected by owner</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .page {
          display: flex;
          min-height: 100vh;
        }

        .market-sidebar {
          width: 250px;
          background-color: #fff;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        .content {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .page-title {
          font-size: 2rem;
          color: #333;
          margin-bottom: 2rem;
          font-weight: 600;
        }

        .no-requests {
          text-align: center;
          color: #666;
          font-size: 1.1rem;
          padding: 3rem;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .requests-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background-color: #fff;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .property-title {
          font-size: 1.25rem;
          color: #222;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .status-text {
          margin-bottom: 0.75rem;
          color: #555;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-badge.pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .status-badge.approved {
          background-color: #d4edda;
          color: #155724;
        }

        .status-badge.rejected {
          background-color: #f8d7da;
          color: #721c24;
        }

        .status-message {
          margin-top: 1rem;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .status-message.pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .status-message.approved {
          background-color: #d4edda;
          color: #155724;
        }

        .status-message.rejected {
          background-color: #f8d7da;
          color: #721c24;
        }

        /* Tablet - screens below 1024px */
        @media (max-width: 1024px) {
          .market-sidebar {
            width: 200px;
          }

          .content {
            padding: 1.5rem;
          }

          .requests-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.25rem;
          }

          .page-title {
            font-size: 1.75rem;
          }
        }

        /* Mobile - screens below 768px */
        @media (max-width: 768px) {
          .page {
            flex-direction: column;
          }

          .market-sidebar {
            width: 100%;
            height: auto;
            position: relative;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          .content {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .requests-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .card {
            padding: 1.25rem;
          }

          .property-title {
            font-size: 1.1rem;
          }
        }

        /* Small mobile - screens below 480px */
        @media (max-width: 480px) {
          .content {
            padding: 0.75rem;
          }

          .page-title {
            font-size: 1.25rem;
            margin-bottom: 1rem;
          }

          .card {
            padding: 1rem;
          }

          .property-title {
            font-size: 1rem;
          }

          .status-message {
            padding: 0.5rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </>
  );
}