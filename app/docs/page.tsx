"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch("/api/doc")
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error("Error loading API spec:", err));
  }, []);

  if (!isMounted || !spec) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-indigo-600 font-semibold text-sm tracking-wide">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading API Specs...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 w-full flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl border border-slate-200 p-6 shadow-xl shadow-slate-100">
        
        {/* Vibrant Light Header */}
        <div className="border-b border-slate-100 pb-5 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-xl shadow-md shadow-indigo-200">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Employee Portal API Explorer
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Interactive API testing & route documentation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              v1.0.0 Live
            </span>
          </div>
        </div>

        {/* Dynamic & Sleek Styling Customization */}
        <style jsx global>{`
          /* Hide internal boring Swagger info */
          .swagger-ui .info,
          .swagger-ui .scheme-container {
            display: none !important;
          }

          /* Full Width Wrapper */
          .swagger-ui .wrapper {
            padding: 0 !important;
            max-width: 100% !important;
          }

          /* Category / Tag Headings */
          .swagger-ui .opblock-tag {
            font-size: 15px !important;
            font-weight: 700 !important;
            color: #0f172a !important;
            padding: 8px 0 !important;
            margin-top: 10px !important;
            border-bottom: 2px solid #f1f5f9 !important;
          }

          /* Endpoint Cards Styling */
          .swagger-ui .opblock {
            border-radius: 12px !important;
            margin: 0 0 12px 0 !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) !important;
            border: 1px solid #e2e8f0 !important;
            transition: all 0.2s ease-in-out !important;
          }
          .swagger-ui .opblock:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08) !important;
          }

          /* Summary Rows */
          .swagger-ui .opblock .opblock-summary {
            padding: 10px 14px !important;
          }
          .swagger-ui .opblock .opblock-summary-method {
            font-size: 12px !important;
            font-weight: 700 !important;
            border-radius: 6px !important;
            min-width: 65px !important;
            text-align: center !important;
          }
          .swagger-ui .opblock .opblock-summary-path {
            font-size: 13px !important;
            font-weight: 600 !important;
            color: #1e293b !important;
          }
          .swagger-ui .opblock .opblock-summary-description {
            font-size: 12px !important;
            color: #64748b !important;
          }
        `}</style>

        {/* Swagger UI Container */}
        <div className="swagger-custom-wrapper">
          <SwaggerUI spec={spec} />
        </div>
      </div>
    </div>
  );
}