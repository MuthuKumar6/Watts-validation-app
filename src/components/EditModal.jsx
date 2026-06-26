

// import { useState, useEffect } from "react";
// import { updateAsset } from "../services/api";
// import { T } from "./LoginPage";

// const WATT_KEYS_ALL = ["20", "25", "40", "45", "60", "70", "90", "120", "200"];

// export default function EditModal({ data, onClose, onSave }) {
//     const [form, setForm] = useState({
//         ...data.watts,
//         pre_total_watts: data.watts?.pre_total_watts || "0",
//         remarks: data.watts?.remarks || data.remarks || "",
//     });

//     const [loading, setLoading] = useState(false);
//     const [saved, setSaved] = useState(false);
//     const [errorMsg, setErrorMsg] = useState("");

//     /* Auto-compute total_watts = sum(quantity * watt_rating) */
//     useEffect(() => {
//         const total = WATT_KEYS_ALL.reduce((sum, wattStr) => {
//             const quantity = parseInt(form[wattStr] || 0);
//             const watt = parseInt(wattStr);
//             return sum + quantity * watt;
//         }, 0);

//         // Only update if value actually changed (prevents infinite loop)
//         if (total.toString() !== form.total_watts) {
//             setForm((prev) => ({ ...prev, total_watts: total.toString() }));
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [WATT_KEYS_ALL.map((k) => form[k]).join(",")]);

//     const handleChange = (key, val) => {
//         setForm((prev) => ({ ...prev, [key]: val }));
//         if (errorMsg) setErrorMsg("");
//     };

//     const handleSave = async () => {
//         setLoading(true);
//         setErrorMsg("");

//         try {
//             const payload = {
//                 _id: data._id,
//                 modem_imei_no: data.modem_imei_no,
//                 watts: form,
//                 user_details: JSON.parse(localStorage.getItem("panchayatUser"))?.username || "Unknown",
//                 remarks: form.remarks || "",
//             };

//             const apiResponse = await updateAsset(payload);

//             setSaved(true);

//             setTimeout(() => {
//                 onSave();
//                 onClose();
//             }, 700);

//         } catch (err) {
//             console.error("Update Error:", err);
//             const message = err?.response?.data?.message ||
//                 err?.message ||
//                 "Failed to save changes. Please check your connection.";
            
//             setErrorMsg(message);
//             alert(`Failed to save: ${message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ESC key support */
//     useEffect(() => {
//         const handler = (e) => {
//             if (e.key === "Escape") onClose();
//         };
//         window.addEventListener("keydown", handler);
//         return () => window.removeEventListener("keydown", handler);
//     }, [onClose]);

//     return (
//         <div
//             onClick={(e) => e.target === e.currentTarget && onClose()}
//             style={{
//                 position: "fixed", inset: 0,
//                 background: "rgba(0,0,0,0.45)",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 zIndex: 10000, padding: "1rem",
//             }}
//         >
//             <div style={{
//                 background: T.surface,
//                 borderRadius: T.radiusXl,
//                 width: "100%", maxWidth: 560,
//                 maxHeight: "90vh", overflowY: "auto",
//                 border: T.border,
//             }}>
//                 {/* Header */}
//                 <div style={{
//                     display: "flex", justifyContent: "space-between", alignItems: "center",
//                     padding: "1.25rem 1.5rem", borderBottom: T.border,
//                     position: "sticky", top: 0, background: T.surface,
//                     borderRadius: `${T.radiusXl} ${T.radiusXl} 0 0`, zIndex: 1,
//                 }}>
//                     <div>
//                         <div style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary }}>
//                             Edit Asset
//                         </div>
//                         <div style={{ fontSize: 12, fontFamily: "monospace", color: T.textSecondary, marginTop: 2 }}>
//                             IMEI: {data.modem_imei_no}
//                         </div>
//                     </div>
//                     <button onClick={onClose} style={{
//                         width: 32, height: 32, borderRadius: T.radius,
//                         background: T.surfaceAlt, border: T.borderEm,
//                         cursor: "pointer", fontSize: 16, color: T.textSecondary,
//                     }}>✕</button>
//                 </div>

//                 {/* Body */}
//                 <div style={{ padding: "1.5rem" }}>
//                     {/* Watt fields */}
//                     <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: "1.5rem" }}>
//                         {WATT_KEYS_ALL.map((k) => (
//                             <div key={k}>
//                                 <label style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 6, display: "block" }}>
//                                     {k}W lights
//                                 </label>
//                                 <input
//                                     type="number" min="0"
//                                     value={form[k] || 0}
//                                     onChange={(e) => handleChange(k, e.target.value)}
//                                     style={{
//                                         width: "90%", padding: "9px 12px", border: "1.5px solid #C8CCD0",
//                                         borderRadius: T.radius, fontSize: 16, fontWeight: 600,
//                                         background: T.surfaceAlt, color: T.textPrimary, outline: "none",
//                                     }}
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     {/* Previous Total Watts */}
//                     <div style={{ marginBottom: "1.5rem" }}>
//                         <label style={{ fontSize: 13, fontWeight: 600, color: T.textSecondary, marginBottom: 6, display: "block" }}>
//                             Previous Total Watts
//                         </label>
//                         <input
//                             type="number" min="0"
//                             value={form.pre_total_watts || 0}
//                             onChange={(e) => handleChange("pre_total_watts", e.target.value)}
//                             style={{
//                                 width: "97%", padding: "10px 12px", border: "1.5px solid #C8CCD0",
//                                 borderRadius: T.radius, fontSize: 16, fontWeight: 600,
//                                 background: T.surfaceAlt, color: T.textPrimary, outline: "none",
//                             }}
//                         />
//                     </div>

//                     {/* Remarks */}
//                     <div style={{ marginBottom: "1.5rem" }}>
//                         <label style={{ fontSize: 13, fontWeight: 600, color: T.textSecondary, marginBottom: 6, display: "block" }}>
//                             Remarks / Notes
//                         </label>
//                         <textarea
//                             value={form.remarks || ""}
//                             onChange={(e) => handleChange("remarks", e.target.value)}
//                             placeholder="Add remarks, observations, maintenance notes..."
//                             rows={4}
//                             style={{
//                                 width: "97%", padding: "10px 12px", border: "1.5px solid #C8CCD0",
//                                 borderRadius: T.radius, fontSize: 14, background: T.surfaceAlt,
//                                 color: T.textPrimary, outline: "none", resize: "vertical",
//                             }}
//                         />
//                     </div>

//                     {/* Computed Total Watts */}
//                     <div style={{
//                         padding: "1rem 1.25rem", borderRadius: T.radiusLg,
//                         background: T.indigoDim, border: `0.5px solid ${T.indigo}30`,
//                         marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center"
//                     }}>
//                         <div style={{ fontSize: 11, fontWeight: 600, color: T.indigoText, textTransform: "uppercase" }}>
//                             Current Total Watts
//                         </div>
//                         <div style={{ fontSize: 26, fontWeight: 700, color: T.indigoText }}>
//                             {parseInt(form.total_watts || 0).toLocaleString()} W
//                         </div>
//                     </div>

//                     {/* Error Message */}
//                     {errorMsg && (
//                         <div style={{
//                             background: "#fee2e2", color: "#b91c1c", padding: "10px 12px",
//                             borderRadius: T.radius, marginBottom: "1rem", fontSize: 13
//                         }}>
//                             ⚠️ {errorMsg}
//                         </div>
//                     )}

//                     {/* Buttons */}
//                     <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//                         <button onClick={onClose} style={{
//                             padding: "10px 24px", border: T.borderEm, borderRadius: T.radius,
//                             background: T.surface, color: T.textSecondary, cursor: "pointer",
//                         }}>
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleSave}
//                             disabled={loading || saved}
//                             style={{
//                                 padding: "10px 28px", background: saved ? T.green : T.indigo,
//                                 color: "#fff", border: "none", borderRadius: T.radius,
//                                 cursor: loading ? "not-allowed" : "pointer", fontWeight: 600,
//                                 opacity: loading ? 0.7 : 1,
//                             }}
//                         >
//                             {saved ? "✓ Saved" : loading ? "Saving..." : "Save Changes"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import { updateAsset } from "../services/api";
import { T } from "./LoginPage";

export default function EditModal({ data, onClose, onSave }) {
    // Dynamically extract watt keys (excluding special fields)
    const getWattKeys = (wattsData) => {
        if (!wattsData) return [];
        return Object.keys(wattsData)
            .filter(key => 
                !isNaN(key) && 
                key !== "total_watts" && 
                key !== "_id" && 
                key !== "pre_total_watts" && 
                key !== "remarks"
            )
            .sort((a, b) => parseInt(a) - parseInt(b)); // Sort numerically
    };

    const dynamicWattKeys = getWattKeys(data.watts);

    const [form, setForm] = useState({
        ...data.watts,
        pre_total_watts: data.watts?.pre_total_watts || "0",
        remarks: data.watts?.remarks || data.remarks || "",
    });

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    /* Auto-compute total_watts dynamically */
    useEffect(() => {
        const total = dynamicWattKeys.reduce((sum, wattStr) => {
            const quantity = parseInt(form[wattStr] || 0);
            const watt = parseInt(wattStr);
            return sum + quantity * watt;
        }, 0);

        // Only update if value changed
        if (total.toString() !== form.total_watts) {
            setForm((prev) => ({ ...prev, total_watts: total.toString() }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dynamicWattKeys, ...dynamicWattKeys.map(k => form[k])]);

    const handleChange = (key, val) => {
        setForm((prev) => ({ ...prev, [key]: val }));
        if (errorMsg) setErrorMsg("");
    };

    const handleSave = async () => {
        setLoading(true);
        setErrorMsg("");

        try {
            const payload = {
                _id: data._id,
                modem_imei_no: data.modem_imei_no,
                watts: form,
                user_details: JSON.parse(localStorage.getItem("panchayatUser"))?.username || "Unknown",
                remarks: form.remarks || "",
            };

            const apiResponse = await updateAsset(payload);

            setSaved(true);

            setTimeout(() => {
                onSave();
                onClose();
            }, 700);

        } catch (err) {
            console.error("Update Error:", err);
            const message = err?.response?.data?.message ||
                err?.message ||
                "Failed to save changes. Please check your connection.";
            
            setErrorMsg(message);
            alert(`Failed to save: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    /* ESC key support */
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && onClose()}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 10000, padding: "1rem",
            }}
        >
            <div style={{
                background: T.surface,
                borderRadius: T.radiusXl,
                width: "100%", maxWidth: 560,
                maxHeight: "90vh", overflowY: "auto",
                border: T.border,
            }}>
                {/* Header */}
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "1.25rem 1.5rem", borderBottom: T.border,
                    position: "sticky", top: 0, background: T.surface,
                    borderRadius: `${T.radiusXl} ${T.radiusXl} 0 0`, zIndex: 1,
                }}>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary }}>
                            Edit Asset
                        </div>
                        <div style={{ fontSize: 12, fontFamily: "monospace", color: T.textSecondary, marginTop: 2 }}>
                            IMEI: {data.modem_imei_no}
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        width: 32, height: 32, borderRadius: T.radius,
                        background: T.surfaceAlt, border: T.borderEm,
                        cursor: "pointer", fontSize: 16, color: T.textSecondary,
                    }}>✕</button>
                </div>

                {/* Body */}
                <div style={{ padding: "1.5rem" }}>
                    {/* Watt fields - Now Dynamic */}
                    <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", 
                        gap: 14, 
                        marginBottom: "1.5rem" 
                    }}>
                        {dynamicWattKeys.map((k) => (
                            <div key={k}>
                                <label style={{ 
                                    fontSize: 12, 
                                    fontWeight: 600, 
                                    color: T.textSecondary, 
                                    marginBottom: 6, 
                                    display: "block" 
                                }}>
                                    {k}W lights
                                </label>
                                <input
                                    type="number" 
                                    min="0"
                                    value={form[k] || 0}
                                    onChange={(e) => handleChange(k, e.target.value)}
                                    style={{
                                        width: "80%", 
                                        padding: "9px 12px", 
                                        border: "1.5px solid #C8CCD0",
                                        borderRadius: T.radius, 
                                        fontSize: 16, 
                                        fontWeight: 600,
                                        background: T.surfaceAlt, 
                                        color: T.textPrimary, 
                                        outline: "none",
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Previous Total Watts */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ 
                            fontSize: 13, 
                            fontWeight: 600, 
                            color: T.textSecondary, 
                            marginBottom: 6, 
                            display: "block" 
                        }}>
                            Previous Total Watts
                        </label>
                        <input
                            type="number" 
                            min="0"
                            value={form.pre_total_watts || 0}
                            onChange={(e) => handleChange("pre_total_watts", e.target.value)}
                            style={{
                                width: "90%", 
                                padding: "10px 12px", 
                                border: "1.5px solid #C8CCD0",
                                borderRadius: T.radius, 
                                fontSize: 16, 
                                fontWeight: 600,
                                background: T.surfaceAlt, 
                                color: T.textPrimary, 
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* Remarks */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ 
                            fontSize: 13, 
                            fontWeight: 600, 
                            color: T.textSecondary, 
                            marginBottom: 6, 
                            display: "block" 
                        }}>
                            Remarks / Notes
                        </label>
                        <textarea
                            value={form.remarks || ""}
                            onChange={(e) => handleChange("remarks", e.target.value)}
                            placeholder="Add remarks, observations, maintenance notes..."
                            rows={4}
                            style={{
                                width: "90%", 
                                padding: "10px 12px", 
                                border: "1.5px solid #C8CCD0",
                                borderRadius: T.radius, 
                                fontSize: 14, 
                                background: T.surfaceAlt,
                                color: T.textPrimary, 
                                outline: "none", 
                                resize: "vertical",
                            }}
                        />
                    </div>

                    {/* Computed Total Watts */}
                    <div style={{
                        padding: "1rem 1.25rem", 
                        borderRadius: T.radiusLg,
                        background: T.indigoDim, 
                        border: `0.5px solid ${T.indigo}30`,
                        marginBottom: "1.5rem", 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center"
                    }}>
                        <div style={{ 
                            fontSize: 11, 
                            fontWeight: 600, 
                            color: T.indigoText, 
                            textTransform: "uppercase" 
                        }}>
                            Current Total Watts
                        </div>
                        <div style={{ 
                            fontSize: 26, 
                            fontWeight: 700, 
                            color: T.indigoText 
                        }}>
                            {parseInt(form.total_watts || 0).toLocaleString()} W
                        </div>
                    </div>

                    {/* Error Message */}
                    {errorMsg && (
                        <div style={{
                            background: "#fee2e2", 
                            color: "#b91c1c", 
                            padding: "10px 12px",
                            borderRadius: T.radius, 
                            marginBottom: "1rem", 
                            fontSize: 13
                        }}>
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <button onClick={onClose} style={{
                            padding: "10px 24px", 
                            border: T.borderEm, 
                            borderRadius: T.radius,
                            background: T.surface, 
                            color: T.textSecondary, 
                            cursor: "pointer",
                        }}>
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || saved}
                            style={{
                                padding: "10px 28px", 
                                background: saved ? T.green : T.indigo,
                                color: "#fff", 
                                border: "none", 
                                borderRadius: T.radius,
                                cursor: loading ? "not-allowed" : "pointer", 
                                fontWeight: 600,
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {saved ? "✓ Saved" : loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}