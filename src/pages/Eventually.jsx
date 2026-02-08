import { useState, useRef } from "react";
import Layout from "../components/Layout";

/* ---------------- MOCK API (frontend only) ---------------- */
function mockSubmit(payload) {
  return new Promise((resolve, reject) => {
    const random = Math.random();

    // delayed success (5–10 sec)
    if (random < 0.3) {
      const delay = 5000 + Math.random() * 5000;
      setTimeout(() => {
        resolve({ status: 200, data: payload, delay });
      }, delay);
    }
    // temporary failure
    else if (random < 0.6) {
      setTimeout(() => {
        reject({ status: 503 });
      }, 1000);
    }
    // immediate success
    else {
      setTimeout(() => {
        resolve({ status: 200, data: payload, delay: 1000 });
      }, 1000);
    }
  });
}

const MAX_RETRIES = 3;

export default function Eventually() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [delayInfo, setDelayInfo] = useState("");

  const retryCount = useRef(0);
  const requestIdRef = useRef(null);

  const submitWithRetry = async (payload, requestId) => {
    try {
      setStatus(retryCount.current === 0 ? "pending" : "retrying");

      const res = await mockSubmit(payload);

      // ignore late responses
      if (requestIdRef.current !== requestId) return;

      setStatus("success");
      setMessage("Submission successful");
      if (res.delay > 1000) {
        setDelayInfo(`Delayed success after ${Math.round(res.delay / 1000)}s`);
      }
    } catch (err) {
      if (err.status === 503 && retryCount.current < MAX_RETRIES) {
        retryCount.current += 1;
        setTimeout(() => submitWithRetry(payload, requestId), 1000);
      } else {
        setStatus("failed");
        setMessage("Failed after maximum retries");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === "pending" || status === "retrying") return;

    retryCount.current = 0;
    setMessage("");
    setDelayInfo("");

    const requestId = crypto.randomUUID();
    requestIdRef.current = requestId;

    submitWithRetry({ email, amount }, requestId);
  };

  const statusStyle = {
    idle: "bg-gray-100 text-gray-700",
    pending: "bg-blue-100 text-blue-800",
    retrying: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <Layout title="Eventually Consistent Form">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 min-h-[60vh]">
        
        {/* -------- LEFT : FORM -------- */}
        <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-6">
              Frontend Intern Assignment – Bhumio
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white text-black
                           border border-gray-300 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                required
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white text-black
                           border border-gray-300 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                disabled={status === "pending" || status === "retrying"}
                className={`w-full py-3 rounded-lg text-white font-semibold transition
                  ${
                    status === "pending" || status === "retrying"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {status === "pending" || status === "retrying"
                  ? "Submitting..."
                  : "Submit"}
              </button>
            </form>
          </div>

          {/* STATUS */}
          <div className="mt-6 space-y-2">
            <span
              className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${statusStyle[status]}`}
            >
              Status: {status}
            </span>

            {message && <p className="text-sm text-gray-700">{message}</p>}
            {delayInfo && (
              <p className="text-sm text-gray-500">{delayInfo}</p>
            )}
          </div>
        </div>

        {/* -------- RIGHT : EXPLANATION -------- */}
        <div className="bg-slate-800 rounded-2xl p-8 text-slate-200 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">How this works</h3>

          <ul className="space-y-3 text-sm leading-relaxed">
            <li>
              <b>Immediate Pending:</b> UI switches to pending instantly on
              submit.
            </li>
            <li>
              <b>Mock API:</b> API behavior is simulated fully on the frontend.
            </li>
            <li>
              <b>Delayed Success:</b> Some successful responses take 5–10
              seconds.
            </li>
            <li>
              <b>Retry Logic:</b> Temporary failures (503) retry up to 3 times.
            </li>
            <li>
              <b>No Duplicates:</b> Submit button is disabled and late responses
              are ignored using a request ID.
            </li>
            <li>
              <b>Clear State:</b> User always sees the current system state.
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
