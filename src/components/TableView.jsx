import { T } from "./LoginPage";

const WATT_KEYS_ALL = ["20", "25", "40", "45", "60", "70", "90", "120", "200"];

export default function TableView({ data }) {
  return (
    <div style={{
      overflowX: "auto",
      border: T.border,
      borderRadius: T.radiusLg,
      background: T.surface,
    }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 13,
        tableLayout: "auto",
        minWidth: 760,
      }}>
        <thead>
          <tr style={{ background: T.surfaceAlt }}>
            <Th style={{ width: 40 }}>#</Th>
            <Th>IMEI</Th>
            {WATT_KEYS_ALL.map((w) => (
              <Th key={w} center>{w}W</Th>
            ))}
            <Th right>Total W</Th>
            <Th right>Prev W</Th>
            <Th center>Trend</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => {
            const curr   = parseInt(d.watts.total_watts || 0);
            const prev   = parseInt(d.watts.pre_total_watts || 0);
            const hasPrev = prev > 0;
            const diff   = curr - prev;
            const pct    = hasPrev ? Math.round((Math.abs(diff) / prev) * 100) : null;
            const trend  = hasPrev
              ? (diff > 0 ? "up" : diff < 0 ? "down" : "same")
              : "none";
            const isEven = idx % 2 === 0;

            return (
              <tr key={d.modem_imei_no}
                style={{ background: isEven ? T.surface : T.surfaceAlt }}>
                <Td muted>{idx + 1}</Td>
                <Td mono>{d.modem_imei_no}</Td>

                {WATT_KEYS_ALL.map((w) => {
                  const n = parseInt(d.watts[w]) || 0;
                  return (
                    <Td key={w} center
                      style={{ color: n === 0 ? T.textTertiary : T.textPrimary }}>
                      {n}
                    </Td>
                  );
                })}

                <Td right bold>{curr.toLocaleString()}</Td>
                <Td right muted>{hasPrev ? prev.toLocaleString() : "—"}</Td>

                <Td center>
                  {trend === "up"   && <Badge color={T.green}       bg={T.greenBg} label={`↑ ${pct}%`} />}
                  {trend === "down" && <Badge color={T.red}         bg={T.redBg}   label={`↓ ${pct}%`} />}
                  {(trend === "same" || trend === "none") &&
                    <Badge color={T.textTertiary} bg={T.surfaceAlt} label="—" />}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, center, right, style: extra = {} }) {
  return (
    <th style={{
      padding: "10px 14px",
      fontSize: 11, fontWeight: 600,
      color: T.textSecondary,
      textAlign: center ? "center" : right ? "right" : "left",
      borderBottom: T.border,
      whiteSpace: "nowrap",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      ...extra,
    }}>
      {children}
    </th>
  );
}

function Td({ children, center, right, muted, bold, mono, style: extra = {} }) {
  return (
    <td style={{
      padding: "10px 14px",
      color: muted ? T.textTertiary : T.textPrimary,
      borderBottom: `0.5px solid #E1E4E8`,
      whiteSpace: "nowrap",
      textAlign: center ? "center" : right ? "right" : "left",
      fontFamily: mono ? "monospace" : undefined,
      fontWeight: bold ? 600 : undefined,
      fontSize: mono ? 12 : 13,
      ...extra,
    }}>
      {children}
    </td>
  );
}

function Badge({ color, bg, label }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 8px", borderRadius: 999,
      fontSize: 11, fontWeight: 600,
      background: bg, color,
      border: `0.5px solid ${color}30`,
    }}>
      {label}
    </span>
  );
}