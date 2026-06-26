
import { useState, useMemo } from "react";
import { fetchAssetDetails } from "../services/api";
import CardView from "./CardView";
import TableView from "./TableView";
import { T } from "./LoginPage";

const WATT_KEYS_ALL = ["20", "25", "40", "45", "60", "70", "90", "120", "200"];
const PAGE_SIZE = 10;

const FILTERS = [
    { key: "all", label: "All assets" },
    { key: "up", label: "Increased" },
    { key: "down", label: "Decreased" },
    { key: "high", label: "≥ 1000 W" },
];

const LOCATIONS = [
    { id: "6699f71b2c434cb8bcf43e75", name: "Palani" },
    { id: "6699f91e2c434cb8bcf43e8b", name: "Oddanchatram" },
    { id: "6699f9a32c434cb8bcf43e8d", name: "Dharmapuri" },
    { id: "6699fb842c434cb8bcf43eb7", name: "Gudalur" },
    { id: "6699fcc8d084534856fe33c8", name: "Usilampatti" },
    { id: "6699fdc5d084534856fe33d8", name: "Rameswaram" },
    { id: "6699fe64d084534856fe33da", name: "Poonamallee" },
    { id: "6699ff63d084534856fe33de", name: "Thiruvathipuram" },
    { id: "6699fec9d084534856fe33dc", name: "Walajapet" },
];

export default function AssetListPage({ user, onLogout }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [view, setView] = useState("card");

    // Filter locations based on search
    const filteredLocations = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();
        if (!q) return LOCATIONS;
        return LOCATIONS.filter(loc =>
            loc.name.toLowerCase().includes(q)
        );
    }, [searchTerm]);

    const load = async (id) => {
        setLoading(true);
        setError("");
        setData([]);
        setPage(1);
        setFilter("all");
        setSearch("");

        try {
            const result = await fetchAssetDetails(id);
            if (!Array.isArray(result) || result.length === 0) {
                throw new Error("No records found for this Panchayat ID.");
            }
            setData(result);
        } catch (err) {
            setError(err.message || "Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (location) => {
        setSelectedLocation(location);
        setSearchTerm(location.name);
        setIsDropdownOpen(false);
        load(location.id);
        localStorage.setItem("selectedPanchayat", location.name);
    };

    const handleFetch = (e) => {
        e.preventDefault();
        if (!selectedLocation) return;
        load(selectedLocation.id);
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return data.filter((d) => {
            if (q && !d.modem_imei_no.toLowerCase().includes(q)) return false;
            const curr = parseInt(d.watts.total_watts || 0);
            const prev = parseInt(d.watts.pre_total_watts || 0);
            if (filter === "up") return prev > 0 && curr > prev;
            if (filter === "down") return prev > 0 && curr < prev;
            if (filter === "high") return curr >= 1000;
            return true;
        });
    }, [data, search, filter]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const summary = useMemo(() => {
        const totalWatts = data.reduce((s, d) => s + parseInt(d.watts.total_watts || 0), 0);
        const totalLights = data.reduce(
            (s, d) => s + WATT_KEYS_ALL.reduce((a, w) => a + (parseInt(d.watts[w]) || 0), 0), 0
        );
        const increased = data.filter((d) => {
            const c = parseInt(d.watts.total_watts || 0);
            const p = parseInt(d.watts.pre_total_watts || 0);
            return p > 0 && c > p;
        }).length;
        return { totalWatts, totalLights, increased };
    }, [data]);

    const refreshData = () => {
        if (selectedLocation) {
            load(selectedLocation.id);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column" }}>

            {/* Top navbar */}
            <nav style={{
                background: T.surface, borderBottom: T.border,
                padding: "0 1.5rem", height: 56,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky", top: 0, zIndex: 100,
                boxSizing: "border-box",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: 8, background: T.indigo,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: T.textPrimary }}>
                        Panchayat Asset Portal
                    </span>
                    {selectedLocation && (
                        <span style={{
                            fontSize: 12, padding: "2px 8px", borderRadius: 999,
                            background: T.indigoDim, color: T.indigoText, fontWeight: 500,
                        }}>
                            {selectedLocation.name}
                        </span>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: T.indigoDim,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 600, color: T.indigoText,
                    }}>
                        {(user?.username || "U").slice(0, 2).toUpperCase()}
                    </div>
                    <button onClick={onLogout} style={{
                        padding: "6px 14px", fontSize: 13,
                        background: "transparent", color: T.textSecondary,
                        border: T.borderEm, borderRadius: T.radius, cursor: "pointer",
                    }}>
                        Sign out
                    </button>
                </div>
            </nav>

            {/* Main content */}
            <main style={{
                flex: 1, padding: "1.75rem 1.5rem ",
                maxWidth: 1200, margin: "0 auto",
                width: "100%", boxSizing: "border-box",
            }}>

                {/* Searchable Dropdown + Fetch */}
                <div style={{
                    background: T.surface, border: T.border,
                    borderRadius: T.radiusLg, padding: "1.25rem",
                    marginBottom: "1.5rem",
                }}>
                    <form onSubmit={handleFetch} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 280, position: "relative" }}>
                            <svg style={{
                                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                                color: T.textTertiary, pointerEvents: "none", zIndex: 2,
                            }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>

                            <input
                                type="text"
                                placeholder="Search Panchayat or Municipality..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                style={{
                                    width: "100%", padding: "10px 14px 10px 38px",
                                    border: "1.5px solid #C8CCD0", borderRadius: T.radius,
                                    fontSize: 14, background: T.surfaceAlt, color: T.textPrimary,
                                    outline: "none", boxSizing: "border-box",
                                }}
                            />

                            {/* Dropdown List */}
                            {isDropdownOpen && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    background: T.surface,
                                    border: T.border,
                                    borderRadius: T.radius,
                                    marginTop: 4,
                                    maxHeight: 280,
                                    overflowY: "auto",
                                    zIndex: 1000,
                                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                                    color: "black"
                                }}>
                                    {filteredLocations.length > 0 ? (
                                        filteredLocations.map((loc) => (
                                            <div
                                                key={loc.id}
                                                onClick={() => handleSelect(loc)}
                                                style={{
                                                    padding: "10px 14px",
                                                    cursor: "pointer",
                                                    borderBottom: `1px solid ${T.borderColor || "#eee"}`,
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = T.indigoDim}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                            >
                                                {loc.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: "12px 14px", color: T.textTertiary }}>
                                            No matching location found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!selectedLocation || loading}
                            style={{
                                padding: "10px 22px", background: T.indigo, color: "#fff",
                                border: "none", borderRadius: T.radius, fontSize: 14,
                                fontWeight: 600, cursor: (!selectedLocation || loading) ? "not-allowed" : "pointer",
                                opacity: (!selectedLocation || loading) ? 0.65 : 1,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {loading ? "Loading…" : "Fetch Data"}
                        </button>

                        {selectedLocation && (
                            <button
                                type="button"
                                onClick={() => load(selectedLocation.id)}
                                disabled={loading}
                                title="Refresh"
                                style={{
                                    padding: "10px 14px", background: T.surfaceAlt,
                                    color: T.textSecondary, border: T.borderEm,
                                    borderRadius: T.radius, cursor: "pointer", fontSize: 16,
                                }}
                            >
                                ↻
                            </button>
                        )}
                    </form>
                </div>

                {/* Rest of your component remains the same */}
                {/* Summary metric cards */}
                {!loading && !error && data.length > 0 && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: 12, marginBottom: "1.5rem",
                    }}>
                        <MetricCard icon="🏘" label="Total modems" value={data.length} color={T.indigoDim} textColor={T.indigoText} />
                        <MetricCard icon="💡" label="Streetlights" value={summary.totalLights.toLocaleString()} color={T.amberBg} textColor={T.amber} />
                        <MetricCard icon="⚡" label="Total watts" value={summary.totalWatts.toLocaleString()} color={T.greenBg} textColor={T.green} />
                        <MetricCard icon="📈" label="Increased" value={summary.increased} color="#F0F9FF" textColor="#0369A1" />
                    </div>
                )}

                {/* Controls, Empty States, Data views, Pagination... (same as before) */}
                {!loading && data.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                                <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textTertiary }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by IMEI…"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    style={{
                                        width: "95%", padding: "9px 14px 9px 34px",
                                        border: T.borderEm, borderRadius: T.radius, fontSize: 13,
                                        background: T.surface, color: T.textPrimary, outline: "none",
                                    }}
                                />
                            </div>

                            <div style={{ display: "flex", border: T.borderEm, borderRadius: T.radius, overflow: "hidden" }}>
                                {[["card", "Cards"], ["table", "Table"]].map(([v, lbl]) => (
                                    <button
                                        key={v}
                                        onClick={() => setView(v)}
                                        style={{
                                            padding: "9px 18px", border: "none", fontSize: 13, fontWeight: 500,
                                            background: view === v ? T.indigo : T.surface,
                                            color: view === v ? "#fff" : T.textSecondary,
                                        }}
                                    >
                                        {lbl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {FILTERS.map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => { setFilter(f.key); setPage(1); }}
                                    style={{
                                        padding: "5px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                                        border: filter === f.key ? `1.5px solid ${T.indigo}` : T.borderEm,
                                        background: filter === f.key ? T.indigoDim : T.surface,
                                        color: filter === f.key ? T.indigoText : T.textSecondary,
                                    }}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty / Loading / Error States */}
                {!selectedLocation && !loading && (
                    <EmptyState icon="🗺" title="No data loaded" desc="Search and select a Panchayat or Municipality above to fetch asset data." />
                )}
                {loading && <EmptyState icon="" title="Fetching assets…" desc="Retrieving streetlight modem data from the server." spinner />}
                {!loading && error && <EmptyState icon="⚠️" title="Could not load data" desc={error} danger />}
                {!loading && !error && data.length > 0 && filtered.length === 0 && (
                    <EmptyState icon="🔍" title="No matching records" desc="Try adjusting your search or filter." />
                )}

                {/* Data Display */}
                {!loading && !error && filtered.length > 0 && (
                    <>
                        {view === "card" ? <CardView data={pageData} onRefresh={refreshData} /> : <TableView data={pageData} />}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", flexWrap: "wrap", gap: 12 }}>
                            <span style={{ fontSize: 13, color: T.textSecondary }}>
                                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} modems
                            </span>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <PagBtn onClick={() => setPage(p => p - 1)} disabled={page === 1} label="← Previous" />
                                <span style={{ padding: "6px 14px", borderRadius: T.radius, background: T.indigoDim, color: T.indigoText, fontSize: 13, fontWeight: 600 }}>
                                    {page} / {totalPages}
                                </span>
                                <PagBtn onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} label="Next →" />
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

/* Keep your helper components unchanged */
function PagBtn({ onClick, disabled, label }) {
    return (
        <button onClick={onClick} disabled={disabled} style={{
            padding: "7px 16px", fontSize: 13, fontWeight: 500,
            background: T.surface, color: disabled ? T.textTertiary : T.textSecondary,
            border: T.borderEm, borderRadius: T.radius, cursor: disabled ? "not-allowed" : "pointer",
        }}>
            {label}
        </button>
    );
}

function MetricCard({ icon, label, value, color, textColor }) {
    return (
        <div style={{ background: color, borderRadius: T.radiusLg, padding: "1rem 1.25rem", border: `0.5px solid ${textColor}20` }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 13, color: textColor, fontWeight: 500, marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: textColor }}>{value}</div>
        </div>
    );
}

function EmptyState({ icon, title, desc, spinner, danger }) {
    return (
        <div style={{
            textAlign: "center", padding: "4rem 1rem",
            background: T.surface, borderRadius: T.radiusLg, border: T.border,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
            {spinner ? (
                <>
                    <div style={{
                        width: 32, height: 32,
                        border: `3px solid ${T.indigoDim}`,
                        borderTopColor: T.indigo,
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                    }} />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </>
            ) : (
                <span style={{ fontSize: 36 }}>{icon}</span>
            )}
            <div style={{ fontSize: 16, fontWeight: 600, color: danger ? T.red : T.textPrimary }}>{title}</div>
            <div style={{ fontSize: 14, color: T.textSecondary, maxWidth: 360 }}>{desc}</div>
        </div>
    );
}