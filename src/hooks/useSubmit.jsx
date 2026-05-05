import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const useSubmit = ({ isAuth = false } = {}) => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const submit = useCallback(
    async (endpoint, body, options = {}) => {
      const { method = "POST" } = options;

      const isFormData = body instanceof FormData;

      setLoading(true);
      setData(null);

      try {
        const headers = {
          Accept: "application/json",
        };

        if (!isFormData) {
          headers["Content-Type"] = "application/json";
        }

        if (isAuth) {
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
        }

        const fetchOptions = {
          method,
          credentials: "include",
          headers,
        };

        // Only include body for non-GET requests
        if (method !== "GET" && method !== "HEAD") {
          fetchOptions.body = isFormData ? body : JSON.stringify(body);
        }

        const res = await fetch(
          `http://localhost:4000/api/auth${endpoint}`,
          fetchOptions,
        );

        const json = await res.json();

        if (!res.ok) {
          let errorMsg = "Something went wrong";

          if (json.message) {
            errorMsg = json.message;
          } else if (json.errors && typeof json.errors === "object") {
            const firstErrorKey = Object.keys(json.errors)[0];
            if (firstErrorKey && Array.isArray(json.errors[firstErrorKey])) {
              errorMsg = json.errors[firstErrorKey][0];
            }
          }

          console.error("Submit API error:", errorMsg);
          toast.error(errorMsg);
          return { ok: false, error: errorMsg, data: json };
        }

        setData(json);
        return { ok: true, data: json };
      } catch (err) {
        const message = err.message || "Network error";
        console.error("Submit request failed:", message);
        toast.error(message);
        return { ok: false, error: message, data: null };
      } finally {
        setLoading(false);
      }
    },
    [isAuth, token],
  );

  return { submit, loading, data };
};

export default useSubmit;
