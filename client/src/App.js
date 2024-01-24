import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from "./components/Layout.jsx";
import AuthForm from "./pages/AuthForm.jsx";
import SignInForm from "./components/SignInForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import MainPage from "./pages/MainPage.jsx";
import EventForm from "./pages/EventForm.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import Guests from "./components/Guests.jsx";
import Program from "./components/Program.jsx";
import Budget from "./components/Budget.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { Loader } from "./components/Loader.jsx";

import { useAuth } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const { jwt, user, loading } = useAuth();

  if (jwt && loading) {
    return <Loader />
  }

  return (
    <Layout>
      <Routes>
        {jwt && user ? (
          <>
            <Route path="/events/all" element={<EventsPage />} />
            <Route path="/events/create" element={<EventForm />} />
            <Route element={<EventDetailPage />}>
              <Route path="/events/:eventID/guests" element={<Guests />} />
              <Route path="/events/:eventID/program" element={<Program />} />
              <Route path="/events/:eventID/budget" element={<Budget />} />
            </Route>
            <Route path="/events/:eventID/update" element={<EventForm />} />
            {user.role === "admin" && (
              <Route path="/admin" element={<AdminPage />} />
            )}
          </>
        ) : (
          <Route element={<AuthForm />}>
            <Route path="login" element={<SignInForm />} />
            <Route path="registration" element={<SignUpForm />} />
          </Route>
        )}
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer position='bottom-right'
        progressStyle={{ background: "#DB4C40" }} // Стили для прогресс-бара />
      />
    </Layout >
  );
}

export default App;
