import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {

    return children;

  }

  try {

    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    const now = Date.now() / 1000;

    if (payload.exp && payload.exp > now) {

      return <Navigate to="/" replace />;

    }

    localStorage.removeItem("token");

    return children;

  } catch {

    localStorage.removeItem("token");

    return children;

  }

}