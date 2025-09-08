import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import JoinForm from "./pages/JoinForm";
import FillForm from "./pages/FillForm";
import AdminFormBuilder from "./pages/AdminFormBuilder";
import PrivateRoute from "./utils/PrivateRoute";
import AdminRoute from "./utils/AdminRoute";
import AdminFormsList from "./pages/AdminFormList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<JoinForm />} />
          <Route path="/fill/:formId" element={<FillForm />} />
        </Route>

        <Route element={<AdminRoute />}>
    <Route path="/admin/create" element={<AdminFormBuilder />} />
    <Route path="/admin/forms" element={<AdminFormsList />} />
  </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
