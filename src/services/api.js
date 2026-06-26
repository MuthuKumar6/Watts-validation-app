// const API_BASE = "https://ccms.ectinfra.in:4040/SLMS/dashboard";
const API_BASE = import.meta.env.VITE_API_BASE;

/* ── Mock Login ──────────────────────────────────────────── */
export async function loginApi({ username, password }) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (username && password) {
        return { mStatusCode: 200, token: `demo-token-${Date.now()}` };
    }
    throw new Error("Invalid credentials");
}

/* ── Fetch assets by Panchayat / Municipality ID ─────────── */
export async function fetchAssetDetails(panchayat_municipality_id) {
    const response = await fetch(`${API_BASE}/getAssetDetailsByPanchayatId`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panchayat_municipality_id }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data = await response.json();
    if (data.mStatusCode !== 200)
        throw new Error(data.mMessage || "Failed to fetch data.");

    return data.mData;
}

/* ── Update asset watt counts ─────────────────────────────── */
export async function updateAsset(payload) {
    console.log("Updating asset with payload:", payload);
    // TODO: replace with your actual update endpoint
    const response = await fetch(`${API_BASE}/updateAssetsWattsByModem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    console.log("Update response:", response);

    if (!response.ok) throw new Error("Failed to update asset");
    return response.json();
}