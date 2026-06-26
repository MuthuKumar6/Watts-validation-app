// import { useState } from "react";
// import EditModal from "./EditModal";
// import { T } from "./LoginPage";

// const WATT_KEYS_CARD = ["20", "40", "70", "90", "120", "200"];


// export default function CardView({ data, onRefresh }) {
//     const [editing, setEditing] = useState(null);


//     return (
//         <>
//             <div style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
//                 gap: 14,
//             }}>
//                 {data.map((item) => (
//                     <ModemCard
//                         key={item.modem_imei_no}
//                         data={item}
//                         onEdit={() => setEditing(item)}
//                     />
//                 ))}
//             </div>

//             {editing && (
//                 <EditModal
//                     data={editing}
//                     onClose={() => setEditing(null)}
//                     onSave={onRefresh}           // ← Now uses refresh instead of reload
//                     // onSave={() => window.location.reload()}
//                 />
//             )}
//         </>
//     );
// }

// function ModemCard({ data, onEdit }) {
//     const curr = parseInt(data.watts.total_watts || 0);
//     const prev = parseInt(data.watts.pre_total_watts || 0);
//     const pct = prev > 0 ? Math.round((Math.abs(curr - prev) / prev) * 100) : 0;
//     const trend = prev > 0 ? (curr > prev ? "up" : "down") : null;

//     return (
//         <div style={{
//             background: T.surface,
//             border: T.border,
//             borderRadius: T.radiusLg,
//             padding: "1.25rem",
//             transition: "box-shadow 0.15s",
//         }}>
//             {/* Card header */}
//             <div style={{
//                 display: "flex", justifyContent: "space-between",
//                 alignItems: "flex-start", marginBottom: 14,
//             }}>
//                 <div>
//                     <div style={{
//                         fontSize: 10, fontWeight: 600, color: T.textTertiary,
//                         letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4,
//                     }}>
//                         Modem IMEI
//                     </div>
//                     <div style={{
//                         fontFamily: "monospace", fontWeight: 700, fontSize: 14,
//                         color: T.textPrimary, letterSpacing: "0.4px",
//                     }}>
//                         {data.modem_imei_no}
//                     </div>
//                 </div>

//                 <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
//                     <span style={{
//                         padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
//                         background: T.greenBg, color: T.green,
//                         border: `0.5px solid ${T.green}25`,
//                         whiteSpace: "nowrap",
//                     }}>
//                         ⚡ {curr.toLocaleString()} W
//                     </span>

//                     {trend === "up" && (
//                         <span style={{
//                             padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
//                             background: "#F0FDF4", color: "#15803D",
//                             border: "0.5px solid #15803D25",
//                         }}>
//                             ↑ {pct}%
//                         </span>
//                     )}
//                     {trend === "down" && (
//                         <span style={{
//                             padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
//                             background: T.redBg, color: T.red,
//                             border: `0.5px solid ${T.red}25`,
//                         }}>
//                             ↓ {pct}%
//                         </span>
//                     )}

//                     <button onClick={onEdit} title="Edit asset" style={{
//                         width: 30, height: 30, borderRadius: T.radius,
//                         background: T.surfaceAlt, border: T.borderEm,
//                         cursor: "pointer", display: "flex",
//                         alignItems: "center", justifyContent: "center",
//                         color: T.textSecondary, fontSize: 14, flexShrink: 0,
//                     }}>
//                         ✏
//                     </button>
//                 </div>
//             </div>

//             {/* Divider */}
//             <div style={{
//                 height: "0.5px", background: "#E1E4E8",
//                 marginBottom: 14,
//             }} />

//             {/* Watt pills */}
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//                 {WATT_KEYS_CARD.map((w) => {
//                     const count = parseInt(data.watts[w]) || 0;
//                     const active = count > 0;
//                     return (
//                         <div key={w} style={{
//                             padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 500,
//                             background: active ? T.indigoDim : T.surfaceAlt,
//                             color: active ? T.indigoText : T.textTertiary,
//                             border: `0.5px solid ${active ? T.indigo + "30" : "#E1E4E8"}`,
//                             opacity: active ? 1 : 0.65,
//                             whiteSpace: "nowrap",
//                         }}>
//                             {count} × {w}W
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Previous watts footer */}
//             {prev > 0 && (
//                 <div style={{
//                     marginTop: 12, fontSize: 12, color: T.textTertiary,
//                     borderTop: `0.5px solid #E1E4E8`, paddingTop: 10,
//                 }}>
//                     Previous reading: {prev.toLocaleString()} W
//                 </div>
//             )}
//         </div>
//     );
// }


import { useState } from "react";
import EditModal from "./EditModal";
import { T } from "./LoginPage";

export default function CardView({ data, onRefresh }) {
    const [editing, setEditing] = useState(null);

    return (
        <>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 14,
            }}>
                {data.map((item) => (
                    <ModemCard
                        key={item.modem_imei_no}
                        data={item}
                        onEdit={() => setEditing(item)}
                    />
                ))}
            </div>

            {editing && (
                <EditModal
                    data={editing}
                    onClose={() => setEditing(null)}
                    onSave={onRefresh}
                />
            )}
        </>
    );
}

function ModemCard({ data, onEdit }) {
    // Dynamically get watt keys (same logic as EditModal)
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
            .sort((a, b) => parseInt(a) - parseInt(b));
    };

    const dynamicWattKeys = getWattKeys(data.watts);

    const curr = parseInt(data.watts?.total_watts || 0);
    const prev = parseInt(data.watts?.pre_total_watts || 0);
    const pct = prev > 0 ? Math.round((Math.abs(curr - prev) / prev) * 100) : 0;
    const trend = prev > 0 ? (curr > prev ? "up" : "down") : null;

    return (
        <div style={{
            background: T.surface,
            border: T.border,
            borderRadius: T.radiusLg,
            padding: "1.25rem",
            transition: "box-shadow 0.15s",
        }}>
            {/* Card header */}
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: 14,
            }}>
                <div>
                    <div style={{
                        fontSize: 10, fontWeight: 600, color: T.textTertiary,
                        letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4,
                    }}>
                        Modem IMEI
                    </div>
                    <div style={{
                        fontFamily: "monospace", fontWeight: 700, fontSize: 14,
                        color: T.textPrimary, letterSpacing: "0.4px",
                    }}>
                        {data.modem_imei_no}
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <span style={{
                        padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                        background: T.greenBg, color: T.green,
                        border: `0.5px solid ${T.green}25`,
                        whiteSpace: "nowrap",
                    }}>
                        ⚡ {curr.toLocaleString()} W
                    </span>

                    {trend === "up" && (
                        <span style={{
                            padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                            background: "#F0FDF4", color: "#15803D",
                            border: "0.5px solid #15803D25",
                        }}>
                            ↑ {pct}%
                        </span>
                    )}
                    {trend === "down" && (
                        <span style={{
                            padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                            background: T.redBg, color: T.red,
                            border: `0.5px solid ${T.red}25`,
                        }}>
                            ↓ {pct}%
                        </span>
                    )}

                    <button onClick={onEdit} title="Edit asset" style={{
                        width: 30, height: 30, borderRadius: T.radius,
                        background: T.surfaceAlt, border: T.borderEm,
                        cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        color: T.textSecondary, fontSize: 14, flexShrink: 0,
                    }}>
                        ✏
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div style={{
                height: "0.5px", background: "#E1E4E8",
                marginBottom: 14,
            }} />

            {/* Watt pills - Now Dynamic */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {dynamicWattKeys.map((w) => {
                    const count = parseInt(data.watts[w]) || 0;
                    const active = count > 0;
                    return (
                        <div key={w} style={{
                            padding: "5px 11px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 500,
                            background: active ? T.indigoDim : T.surfaceAlt,
                            color: active ? T.indigoText : T.textTertiary,
                            border: `0.5px solid ${active ? T.indigo + "30" : "#E1E4E8"}`,
                            opacity: active ? 1 : 0.65,
                            whiteSpace: "nowrap",
                        }}>
                            {count} × {w}W
                        </div>
                    );
                })}
            </div>

            {/* Previous watts footer */}
            {prev > 0 && (
                <div style={{
                    marginTop: 12,
                    fontSize: 12,
                    color: T.textTertiary,
                    borderTop: `0.5px solid #E1E4E8`,
                    paddingTop: 10,
                }}>
                    Previous reading: {prev.toLocaleString()} W
                </div>
            )}
        </div>
    );
}