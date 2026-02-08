import { useState } from "react";
import Layout from "../components/Layout";

export default function Validation() {
  const [form, setForm] = useState({
    email: "",
    amount: "",
  });

  const [clientErrors, setClientErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔁 dynamic rule (changes on every render)
  const strictEmailCheck = Math.random() > 0.5;

  const validateClient = () => {
    const errors = {};

    // required
    if (!form.email) errors.email = "Email is required";
    if (!form.amount) errors.amount = "Amount is required";

    // email rule (dynamic)
    if (form.email) {
      if (!form.email.includes("@")) {
        errors.email = "Invalid email format";
      } else if (strictEmailCheck && !form.email.endsWith(".com")) {
        errors.email = "Email must end with .com (dynamic rule)";
      }
    }

    // numeric
    if (form.amount && isNaN(form.amount)) {
      errors.amount = "Amount must be a number";
    }

    return errors;
  };

  const submit = () => {
    setClientErrors({});
    setServerError("");
    setSuccess("");

    const errors = validateClient();
    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    // 🖥️ mock server validation
    setTimeout(() => {
      if (Math.random() < 0.5) {
        setServerError("Server rejected input despite passing client validation");
      } else {
        setSuccess("Submitted successfully");
      }
    }, 700);
  };

  return (
    <Layout title="Validation That Lies">
      <div className="grid lg:grid-cols-2 gap-8">

        {/* FORM */}
        <div className="bg-slate-900 p-6 rounded-xl space-y-4">
          <h3 className="font-semibold text-lg">Form</h3>

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full p-2 rounded text-black"
          />
          {clientErrors.email && (
            <p className="text-red-400 text-sm">{clientErrors.email}</p>
          )}

          <input
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            className="w-full p-2 rounded text-black"
          />
          {clientErrors.amount && (
            <p className="text-red-400 text-sm">{clientErrors.amount}</p>
          )}

          <button
            onClick={submit}
            className="bg-blue-600 px-5 py-2 rounded font-semibold"
          >
            Submit
          </button>

          {/* SERVER ERROR */}
          {serverError && (
            <p className="text-yellow-400 mt-3">{serverError}</p>
          )}

          {/* SUCCESS */}
          {success && (
            <p className="text-green-400 mt-3">{success}</p>
          )}
        </div>

        {/* EXPLANATION */}
        <div className="bg-slate-800 p-6 rounded-xl text-slate-200">
          <h3 className="text-lg font-semibold mb-3">
            Validation Flow Explained
          </h3>

          <ul className="space-y-2 text-sm leading-relaxed">
            <li>
              <b>Client Validation:</b> Required fields, email format and numeric
              checks run first.
            </li>
            <li>
              <b>Dynamic Rules:</b> Email rules change dynamically (sometimes
              requiring <code>.com</code>).
            </li>
            <li>
              <b>Server Validation:</b> Even valid client inputs may be rejected
              by the server.
            </li>
            <li>
              <b>Error Separation:</b> Client errors and server errors are stored
              and displayed separately.
            </li>
            <li>
              <b>State Preservation:</b> User input is never cleared on error.
            </li>
          </ul>
        </div>

      </div>
    </Layout>
  );
}
