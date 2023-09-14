import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import HomePage from "../pages/HomePage";
import LogInPage from "../pages/LogInPage";
import RegisterPage from "../pages/RegisterPage.jsx";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LogInPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </div>
  );
};

export default App;
