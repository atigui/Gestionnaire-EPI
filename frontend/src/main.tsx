// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import Register from "./pages/register";
import ResetPasswordForm from "./pages/resetPassword";
import ForgotPassword from "./pages/forgotPassword";
import DashboardAdminPage from "./pages/admin/dashboard";
import UsersPage from "./pages/admin/users";
import MaterialsPage from "./pages/admin/materiels";
import EmployeesPage from "./pages/admin/Employees";
import AffectationPage from "./pages/admin/affectations";
import StockPage from "./pages/admin/stock";
import AttributionPage from "./pages/admin/attribution";
import CategoriePage from "./pages/admin/categories";
import ConsultationStocks from "./pages/affectant/stocks";
import AdminProfilePage from "./pages/admin/profile";
import NouvelleAffectation from "./pages/affectant/NouvelleAffectation";
import MesAffectations from "./pages/affectant/listeAffectation";
import HomePage from "./pages/magasinier/dashboardMagasinier";
import NouvelleAttributionPage from "./pages/magasinier/nouvelle-Attribution";
import FicheMatriculePage from "./pages/magasinier/Fiche-Attribution";
import ProfilPage from "./pages/magasinier/Profile";
import ProfilAffectant from "./pages/affectant/profile";
import './index.css';


// Ton composant App
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset/:token" element={<ResetPasswordForm />} />

        <Route path="/admin" element={<DashboardAdminPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/materials" element={<MaterialsPage />} />
        <Route path="/admin/categories" element={<CategoriePage />} />
        <Route path="/admin/stock" element={<StockPage />} />
        <Route path="/admin/employees" element={<EmployeesPage />} />
        <Route path="/admin/affectations" element={<AffectationPage />} />
        <Route path="/admin/attributions" element={<AttributionPage />} />
        <Route path="/profile" element={<AdminProfilePage />} />
        
        <Route path="/stocks" element={<ConsultationStocks />} />
        <Route path="/nouvelle-affectation" element={<NouvelleAffectation />} />
        <Route path="/liste-affectations" element={<MesAffectations />} />
        <Route path="/profile-affecteur" element={<ProfilAffectant />} />

        <Route path="/magasinier" element={<HomePage />} />
        <Route path="/magasinier/nouvelle-attribution" element={<NouvelleAttributionPage />} />
        <Route path="/magasinier/fiches-attributions" element={<FicheMatriculePage />} />
        <Route path="/profile-magasinier" element={<ProfilPage />} />
        

      </Routes>
    </BrowserRouter>
  );
}

// CECI MANQUAIT → code pour afficher l'App dans la page HTML
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
