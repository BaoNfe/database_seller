import { Routes, Route } from "react-router-dom";
import CreateWarehouse from "./createWarehouse.js";
function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<CreateWarehouse />} />
      </Routes>
    </>
  );
}

export default App;
