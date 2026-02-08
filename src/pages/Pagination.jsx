import Layout from "../components/Layout";
import { fetchPage } from "../utils/paginationApi";
import { useState, useRef } from "react";

export default function Pagination() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const seenIds = useRef(new Set());
  const emptyHits = useRef(0);

  const loadMore = async () => {
    if (!hasMore) return;

    const data = await fetchPage();

    // remove duplicates across pages
    const unique = data.filter((item) => {
      if (seenIds.current.has(item.id)) return false;
      seenIds.current.add(item.id);
      return true;
    });

    // detect end of list
    if (unique.length === 0) {
      emptyHits.current += 1;

      // stop after multiple empty / duplicate-only responses
      if (emptyHits.current >= 2) {
        setHasMore(false);
      }
      return;
    }

    emptyHits.current = 0;
    setItems((prev) => [...prev, ...unique]);
  };

  return (
    <Layout title="Broken Pagination">
      <div className="space-y-6">

        {/* ACTION */}
        <button
          disabled={!hasMore}
          onClick={loadMore}
          className="bg-blue-600 px-5 py-2 rounded font-semibold disabled:opacity-50"
        >
          {hasMore ? "Load More" : "No More Data"}
        </button>

        {/* LIST */}
        <ul className="mt-4 space-y-1 text-slate-200">
          {items.map((i) => (
            <li key={i.id}>{i.value}</li>
          ))}
        </ul>

        {/* EXPLANATION */}
        <div className="bg-slate-800 p-6 rounded-xl text-slate-200">
          <h3 className="text-lg font-semibold mb-3">
            Explanation & Edge Cases Handled
          </h3>

          <ul className="space-y-2 text-sm leading-relaxed">
            <li>
              <b>Duplicate Items:</b> A <code>Set</code> of seen IDs is maintained
              across pages. Any item whose ID has already been rendered is
              skipped, preventing overlaps.
            </li>

            <li>
              <b>Overlapping Pages:</b> Since the API may return previously seen
              items, each page is filtered independently without relying on page
              numbers or ordering.
            </li>

            <li>
              <b>Unknown Total Count:</b> The UI never relies on a total count
              from the API and keeps loading until meaningful new data stops
              arriving.
            </li>

            <li>
              <b>End of List Detection:</b> If multiple consecutive API calls
              return only duplicates or empty results, pagination is stopped
              safely.
            </li>

            <li>
              <b>Unstable Ordering:</b> Items are appended only when they are new;
              no assumptions are made about order or page boundaries.
            </li>
          </ul>
        </div>

      </div>
    </Layout>
  );
}
