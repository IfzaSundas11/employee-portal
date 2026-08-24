"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Successful login -> Redirect to Dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* Left Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.logo}>
            ES
          </div>

          <h1>Welcome Back!</h1>

          <p>
            Sign in to your Employee and Staff Portal
            to continue.
          </p>

          <div className={styles.lockIcon}>
            🔐
          </div>

          <div className={styles.securityText}>
            <strong>Secure Access</strong>
            <span>Your account is protected.</span>
          </div>
        </section>

        {/* Login Section */}
        <section className={styles.loginSection}>
          <div className={styles.loginCard}>

            <div className={styles.heading}>
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Role */}
              <div className={styles.formGroup}>
                <label htmlFor="role">
                  Role
                </label>

                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              {/* Remember + Forgot */}
              <div className={styles.options}>

                <label className={styles.remember}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className={styles.forgotButton}
                  onClick={() =>
                    setError(
                      "Password recovery will be implemented in a later task."
                    )
                  }
                >
                  Forgot Password?
                </button>

              </div>

              {/* Error */}
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}

              {/* Login */}
              <button
                type="submit"
                className={styles.loginButton}
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

            </form>

            <div className={styles.footer}>
              Employee & Staff Portal
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}