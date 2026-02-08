import { useState } from "react";
import Layout from "../components/Layout";
import { createEventProcessor } from "../utils/eventProcessor";

const processor = createEventProcessor();

export default function OutOfOrder() {
  const [events, setEvents] = useState([]);
  const [activeIds, setActiveIds] = useState([]);
  const [lastResult, setLastResult] = useState("");

  const handleGenerate = () => {
    const event = generateMockEvent();
    const result = processor.process(event);

    setEvents((prev) => [event, ...prev].slice(0, 6));
    setActiveIds(processor.getActive());
    setLastResult(JSON.stringify(result));
  };

  return (
    <Layout title="Out Of Order Events">
      <div className="space-y-6">

        {/* ACTION */}
        <button
          onClick={handleGenerate}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded font-semibold"
        >
          Generate Random Event
        </button>

        {/* TOP ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Incoming Events */}
          <div className="bg-slate-900 p-5 rounded-xl">
            <h3 className="font-semibold mb-3">Incoming Events</h3>
            <pre className="text-sm text-slate-300 space-y-1">
              {events.map((e, i) => (
                <div key={i}>{JSON.stringify(e)}</div>
              ))}
            </pre>
          </div>

          {/* System State */}
          <div className="bg-slate-900 p-5 rounded-xl">
            <h3 className="font-semibold mb-3">System State</h3>

            <p className="text-sm">
              <b>Active IDs:</b>{" "}
              <span className="text-blue-400">
                {JSON.stringify(activeIds)}
              </span>
            </p>

            <p className="text-sm mt-3">
              <b>Last Result:</b>
            </p>

            <pre className="text-xs mt-1 text-slate-300">
              {lastResult}
            </pre>
          </div>
        </div>

        {/* BOTTOM EXPLANATION */}
        <div className="bg-slate-800 p-6 rounded-xl text-slate-200">
          <h3 className="text-lg font-semibold mb-3">
            Edge Cases Handled
          </h3>

          <ul className="space-y-2 text-sm leading-relaxed">
            <li>
              <b>Late Events:</b> Older timestamps than the last processed
              event for an ID are ignored.
            </li>
            <li>
              <b>Duplicate Events:</b> Replayed events with the same or older
              timestamp are safely ignored.
            </li>
            <li>
              <b>Permanent Deletes:</b> Once an ID is deleted, it is never
              re-added even if future events arrive.
            </li>
            <li>
              <b>No Sorting:</b> Events are processed strictly in arrival
              order without sorting the list.
            </li>
            <li>
              <b>Consistent State:</b> Active IDs always reflect the latest
              valid state.
            </li>
          </ul>
        </div>

      </div>
    </Layout>
  );
}

/* ---------- MOCK SERVER ---------- */
function generateMockEvent() {
  const ids = ["1", "2", "3"];
  const types = ["created", "updated", "deleted"];

  return {
    id: ids[Math.floor(Math.random() * ids.length)],
    type: types[Math.floor(Math.random() * types.length)],
    timestamp: Date.now() - Math.floor(Math.random() * 10000),
  };
}
