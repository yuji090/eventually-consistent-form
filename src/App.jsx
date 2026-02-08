import { useState, useRef } from "react";
import { mockSubmit } from "./mockApi";

const MAX_RETRIES = 3;

function App() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const retryCountRef = useRef(0);
  const requestIdRef = useRef(null);

  const submitWithRetry = async (payload, requestId) => {
    try {
      setStatus(retryCountRef.current === 0 ? "pending" : "retrying");

      const response = await mockSubmit(payload);

      // 🔒 Ignore late responses
      if (requestIdRef.current !== requestId) return;

      setStatus("success");
      setMessage("✅ Submission successful");
    } catch (err) {
      if (err.status === 503 && retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;

        setTimeout(() => {
          submitWithRetry(payload, requestId);
        }, 1000);
      } else {
        setStatus("failed");
        setMessage("❌ Failed after retries");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (status === "pending" || status === "retrying") return;

    const requestId = crypto.randomUUID();
    requestIdRef.current = requestId;
    retryCountRef.current = 0;

    setMessage("");
    submitWithRetry({ email, amount }, requestId);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Eventually Consistent Form</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          required
          onChange={(e) => setAmount(e.target.value)}
        />

        <br /><br />

        <button disabled={status === "pending" || status === "retrying"}>
          Submit
        </button>
      </form>

      <p><strong>Status:</strong> {status}</p>
      <p>{message}</p>
    </div>
  );
}

export default App;
