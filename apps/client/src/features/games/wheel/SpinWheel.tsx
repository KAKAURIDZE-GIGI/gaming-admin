import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import type { WheelSegment } from "@/shared/types";
import { SPIN_DURATION_MS } from "./wheelMath";

function buildSlices(
  segments: WheelSegment[],
  totalWeight: number,
  center: number,
  radius: number,
) {
  let currentAngle = -90;
  return segments.map((segment) => {
    const sliceAngle = (segment.weight / totalWeight) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    const largeArc = sliceAngle > 180 ? 1 : 0;
    const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
    const labelRadius = radius * 0.65;
    return {
      path,
      color: segment.color,
      label: segment.label,
      labelX: center + labelRadius * Math.cos(midAngle),
      labelY: center + labelRadius * Math.sin(midAngle),
      labelRotation: (startAngle + endAngle) / 2,
      sliceAngle,
    };
  });
}

export function SpinWheel({
  segments,
  rotation,
  spinning,
  backgroundColor = "#1F2937",
  borderColor = "#F59E0B",
  size = 340,
}: {
  segments: WheelSegment[];
  rotation: number;
  spinning: boolean;
  backgroundColor?: string;
  borderColor?: string;
  size?: number;
}) {
  const totalWeight = useMemo(
    () => segments.reduce((s, x) => s + x.weight, 0),
    [segments],
  );
  const center = size / 2;
  const radius = size / 2 - 8;
  const slices = useMemo(
    () => buildSlices(segments, totalWeight, center, radius),
    [segments, totalWeight, center, radius],
  );

  if (segments.length < 2 || totalWeight === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">Wheel unavailable.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", width: size, height: size + 20, mx: "auto" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          width: 0,
          height: 0,
          borderLeft: "13px solid transparent",
          borderRight: "13px solid transparent",
          borderTop: `22px solid ${borderColor}`,
          filter: "drop-shadow(0 2px 2px rgba(0,0,0,.4))",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 20,
          transition: spinning
            ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
            : "none",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={center} cy={center} r={radius + 6} fill={borderColor} />
          <circle cx={center} cy={center} r={radius + 2} fill={backgroundColor} />
          {slices.map((slice, i) => (
            <g key={i}>
              <path d={slice.path} fill={slice.color} stroke={backgroundColor} strokeWidth={2} />
              {slice.sliceAngle > 18 && (
                <text
                  x={slice.labelX}
                  y={slice.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={size > 250 ? 11 : 9}
                  fontWeight="bold"
                  transform={`rotate(${slice.labelRotation}, ${slice.labelX}, ${slice.labelY})`}
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {slice.label.length > 10 ? slice.label.slice(0, 9) + "…" : slice.label}
                </text>
              )}
            </g>
          ))}
          <circle cx={center} cy={center} r={radius * 0.12} fill={backgroundColor} stroke={borderColor} strokeWidth={3} />
        </svg>
      </Box>
    </Box>
  );
}
