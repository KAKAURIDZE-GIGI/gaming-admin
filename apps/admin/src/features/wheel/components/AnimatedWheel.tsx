import { useState, useCallback, useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";

interface Segment {
  label: string;
  color: string;
  weight: number;
  prizeType: string;
  prizeAmount: number;
}

interface AnimatedWheelProps {
  segments: Segment[];
  backgroundColor?: string;
  borderColor?: string;
  size?: number;
}

function buildSlices(
  segments: Segment[],
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
    const labelX = center + labelRadius * Math.cos(midAngle);
    const labelY = center + labelRadius * Math.sin(midAngle);
    const labelRotation = (startAngle + endAngle) / 2;

    return {
      path,
      color: segment.color,
      label: segment.label,
      labelX,
      labelY,
      labelRotation,
      sliceAngle,
    };
  });
}

export function AnimatedWheel({
  segments,
  backgroundColor = "#1F2937",
  borderColor = "#F59E0B",
  size = 350,
}: AnimatedWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const totalWeight = useMemo(
    () => segments.reduce((sum, s) => sum + s.weight, 0),
    [segments],
  );

  const center = size / 2;
  const radius = size / 2 - 8;

  const slices = useMemo(
    () => buildSlices(segments, totalWeight, center, radius),
    [segments, totalWeight, center, radius],
  );

  const handleSpin = useCallback(() => {
    if (spinning || segments.length < 2 || totalWeight === 0) return;

    setSpinning(true);
    setResult(null);

    const rand = Math.random() * totalWeight;
    let cumulative = 0;
    let winnerIndex = 0;
    for (let i = 0; i < segments.length; i++) {
      cumulative += segments[i].weight;
      if (rand <= cumulative) {
        winnerIndex = i;
        break;
      }
    }

    let segStart = 0;
    for (let i = 0; i < winnerIndex; i++) {
      segStart += (segments[i].weight / totalWeight) * 360;
    }
    const segSize = (segments[winnerIndex].weight / totalWeight) * 360;
    const segMid = segStart + segSize / 2;

    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const targetRotation = fullSpins * 360 + (360 - segMid);

    setRotation((prev) => prev + targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(segments[winnerIndex].label);
    }, 4000);
  }, [spinning, segments, totalWeight]);

  if (segments.length < 2 || totalWeight === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">
          Not enough segments to display wheel.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          position: "relative",
          width: size,
          height: size + 20,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: `20px solid ${borderColor}`,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 20,
            transition: spinning
              ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={center} cy={center} r={radius + 6} fill={borderColor} />
            <circle
              cx={center}
              cy={center}
              r={radius + 2}
              fill={backgroundColor}
            />

            {slices.map((slice, i) => (
              <g key={i}>
                <path
                  d={slice.path}
                  fill={slice.color}
                  stroke={backgroundColor}
                  strokeWidth={2}
                />
                {slice.sliceAngle > 20 && (
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
                    {slice.label.length > 10
                      ? slice.label.slice(0, 9) + "…"
                      : slice.label}
                  </text>
                )}
              </g>
            ))}

            <circle
              cx={center}
              cy={center}
              r={radius * 0.12}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={3}
            />
          </svg>
        </Box>
      </Box>

      <Button
        variant="contained"
        size="large"
        onClick={handleSpin}
        disabled={spinning}
        sx={{ mt: 3, minWidth: 160, fontWeight: 700, fontSize: 16 }}
      >
        {spinning ? "Spinning..." : "SPIN!"}
      </Button>

      {result && (
        <Typography
          variant="h5"
          sx={{
            mt: 2,
            fontWeight: 700,
            color: "primary.main",
            animation: "fadeIn 0.5s ease-in",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          🎉 {result}!
        </Typography>
      )}
    </Box>
  );
}
