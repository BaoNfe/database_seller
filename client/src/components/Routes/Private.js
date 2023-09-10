import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get("/api/v1/auth/user-auth");
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      } 
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  if (ok) {
    return <Outlet />;
  } else {
    return (
      <div>
        <p>Please log in to access this page.</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }
}