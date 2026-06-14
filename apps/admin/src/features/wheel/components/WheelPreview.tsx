import { Box, Typography } from "@mui/material";

interface Segment {
  label: string;
  color: string;
  weight: number;
}

interface WheelPreviewProps {
  segments: Segment[];
  backgroundColor?: string;
  borderColor?: string;
  size?: number;
}

export function WheelPreview({
  segments,
  backgroundColor = "#1F2937",
  borderColor = "#F59E0B",
  size = 300,
}: WheelPreviewProps) {
  const validSegments = segments.filter((s) => s.label && s.weight > 0);
  const totalWeight = validSegments.reduce((sum, s) => sum + s.weight, 0);

  if (validSegments.length < 2 || totalWeight === 0) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
        }}
      >
        <Typography color="text.secondary" variant="body2" textAlign="center">
          Add at least 2 segments
          <br />
          to see preview
        </Typography>
      </Box>
    );
  }

  const center = size / 2;
  const radius = size / 2 - 8;

  const slices = validSegments.reduce<Array<{
    path: string;
    color: string;
    label: string;
    labelX: number;
    labelY: number;
    rotation: number;
    sliceAngle: number;
  }>>((acc, segment, idx) => {
    const startAngle = idx === 0 ? -90 : acc[idx - 1].rotation + acc[idx - 1].sliceAngle / 2 + acc[idx - 1].sliceAngle / 2;
    const sliceAngle = (segment.weight / totalWeight) * 360;
    const endAngle = startAngle + sliceAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const path = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    // Label position — midpoint of the arc at 65% radius
    const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
    const labelRadius = radius * 0.65;
    const labelX = center + labelRadius * Math.cos(midAngle);
    const labelY = center + labelRadius * Math.sin(midAngle);
    const rotation = (startAngle + endAngle) / 2;

    acc.push({
      path,
      color: segment.color,
      label: segment.label,
      labelX,
      labelY,
      rotation,
      sliceAngle,
    });

    return acc;
  }, []);

  return (
    <Box sx={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={center} cy={center} r={radius + 6} fill={borderColor} />
        <circle cx={center} cy={center} r={radius + 2} fill={backgroundColor} />

        {/* Segments */}
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
                transform={`rotate(${slice.rotation}, ${slice.labelX}, ${slice.labelY})`}
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
              >
                {slice.label.length > 10
                  ? slice.label.slice(0, 9) + "…"
                  : slice.label}
              </text>
            )}
          </g>
        ))}

        {/* Center circle */}
        <circle
          cx={center}
          cy={center}
          r={radius * 0.12}
          fill={backgroundColor}
          stroke={borderColor}
          strokeWidth={3}
        />

        {/* Pointer triangle at top */}
        <polygon
          points={`${center - 10},${4} ${center + 10},${4} ${center},${20}`}
          fill={borderColor}
          stroke={backgroundColor}
          strokeWidth={1}
        />
      </svg>
    </Box>
  );
}
