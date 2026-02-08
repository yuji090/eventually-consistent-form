import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Eventually from "./pages/Eventually";
import OutOfOrder from "./pages/OutOfOrder";
import Pagination from "./pages/Pagination";
import Validation from "./pages/Validation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventual" element={<Eventually />} />
        <Route path="/events" element={<OutOfOrder />} />
        <Route path="/pagination" element={<Pagination />} />
        <Route path="/validation" element={<Validation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
