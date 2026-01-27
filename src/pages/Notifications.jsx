import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

export default function Notifications() {
  const [data, setData] = useState([]);

  useEffect(() => {
    apiFetch("/properties/notifications/my/")
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2>Notifications</h2>
      {data.map((n) => (
        <div className="card" key={n.id}>
          <strong>{n.title}</strong>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
