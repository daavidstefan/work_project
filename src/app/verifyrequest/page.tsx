// "use client";

// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";

// type RequestData = {
//   id: string;
//   status: "pending" | "approved" | "rejected"; // Presupunem aceste statusuri
//   firstname: string;
//   lastname: string;
//   companyname: string;
//   created_at: string;
// };

// export default function VerifyRequestStatus() {
//   const searchParams = useSearchParams();
//   const requestId = searchParams.get("id");

//   return <h1>plm</h1>;
// }

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type RequestData = {
  id: string;
  status: "pending" | "approved" | "rejected"; // Presupunem aceste statusuri
  firstname: string;
  lastname: string;
  companyname: string;
  created_at: string;
};

export default function VerifyRequestStatus() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id");

  // Stări pentru date, încărcare și erori
  const [data, setData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efect pentru a prelua datele când componenta se încarcă sau requestId se schimbă
  useEffect(() => {
    if (!requestId) {
      setError("ID-ul cererii lipsește din URL.");
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      setLoading(true); // Începe încărcarea
      setError(null); // Resetează eroarea
      try {
        // Apeleză endpoint-ul API
        const response = await fetch(`/api/verify-request/${requestId}`);

        // Verifică dacă răspunsul este eșuat
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Cererea nu a putut fi găsită.");
        }

        // Parsează și setează datele
        const result: RequestData = await response.json();
        setData(result);
      } catch (err: any) {
        // Setează starea de eroare
        setError(err.message);
        setData(null);
      } finally {
        // Oprește încărcarea indiferent de rezultat
        setLoading(false);
      }
    };

    fetchStatus();
  }, [requestId]); // Rulează din nou dacă 'requestId' se schimbă

  // Afișează starea de încărcare
  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <p>Se încarcă starea cererii...</p>
      </div>
    );
  }

  // Afișează eroarea
  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <p>Eroare: {error}</p>
      </div>
    );
  }

  // Afișează dacă nu s-au găsit date
  if (!data) {
    return (
      <div style={{ padding: "20px" }}>
        <p>Nu s-au găsit date pentru această cerere.</p>
      </div>
    );
  }

  // Afișează cardul cu date
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        maxWidth: "500px",
        margin: "20px auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0 }}>Detalii Cerere</h2>
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            background: "#eee",
            fontWeight: "bold",
          }}
        >
          {data.status}
        </span>
      </div>

      <div style={{ marginTop: "16px" }}>
        <p>
          <strong>Companie:</strong> {data.companyname}
        </p>
        <p>
          <strong>Solicitant:</strong> {data.firstname} {data.lastname}
        </p>
        <p>
          <strong>Dată trimitere:</strong>{" "}
          {new Date(data.created_at).toLocaleString("ro-RO")}
        </p>
        <p
          style={{
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid #eee",
          }}
        >
          <strong>ID Cerere:</strong> {data.id}
        </p>
      </div>
    </div>
  );
}
