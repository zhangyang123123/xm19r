import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ShoppingListPage from "@/pages/ShoppingListPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shopping" element={<ShoppingListPage />} />
      </Routes>
    </Router>
  );
}
