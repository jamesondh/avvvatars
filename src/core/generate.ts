// Core generation logic for Avvvatars SVG
// This file should be framework-agnostic (no React)

import { BACKGROUND_COLORS, TEXT_COLORS, SHAPE_COLORS } from "../lib/colors";
import { AvatarOptions, ResolvedAvatarOptions, ShapeData } from "./types";
import { SHAPES_DATA } from "./shapes-data"; // We will create this file next
import randomNumber from "../lib/random"; // Reuse the existing random function

const DEFAULTS: Omit<ResolvedAvatarOptions, "displayValue" | "value"> = {
  style: "character",
  size: 32,
  shadow: false,
  border: false,
  borderSize: 2,
  borderColor: "ffffff", // Default to white, ensure no #
  radius: -1, // Use -1 to signal fallback to size/2
};

function resolveOptions(options?: AvatarOptions): ResolvedAvatarOptions {
  const resolved: ResolvedAvatarOptions = {
    style: options?.style ?? DEFAULTS.style,
    size: options?.size ?? DEFAULTS.size,
    shadow: options?.shadow ?? DEFAULTS.shadow,
    border: options?.border ?? DEFAULTS.border,
    borderSize: options?.borderSize ?? DEFAULTS.borderSize,
    borderColor: options?.borderColor ?? DEFAULTS.borderColor,
    // Resolve radius: Use provided, else default to size/2 for circle effect
    radius: options?.radius ?? DEFAULTS.size / 2,
    displayValue: options?.displayValue,
  };

  // Ensure borderColor doesn't have #
  resolved.borderColor = resolved.borderColor.replace("#", "");

  // If original radius option was explicitly provided, use it, otherwise use default derived from size
  resolved.radius = options?.radius ?? resolved.size / 2;

  return resolved;
}

export function generateSvg(value: string, options?: AvatarOptions): string {
  const resolvedOptions = resolveOptions(options);
  const { size, style, displayValue, border, borderSize, borderColor, radius } =
    resolvedOptions;

  // Deterministic keys based on input value
  const colorKey = randomNumber({
    value,
    min: 0,
    max: BACKGROUND_COLORS.length - 1,
  });
  const shapeKey = randomNumber({
    value,
    min: 1,
    max: Object.keys(SHAPES_DATA).length,
  }); // Assuming SHAPES_DATA keys match ShapeN format

  // Colors (ensure no # for direct use in SVG attributes)
  const bgColor = BACKGROUND_COLORS[colorKey].replace("#", "");
  const fgColor =
    style === "character"
      ? TEXT_COLORS[colorKey].replace("#", "")
      : SHAPE_COLORS[colorKey].replace("#", "");

  // Determine background shape attributes
  const bgRx = radius;
  const bgRy = radius;
  const borderAttrs = border
    ? `stroke="#${borderColor}" stroke-width="${borderSize}"`
    : "";

  let contentSvg = "";

  if (style === "character") {
    const name = String(displayValue || value).substring(0, 2);
    const fontSize = Math.round((size / 100) * 37);
    // Use system fonts as a safe fallback in SVG
    const fontFamily =
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";

    contentSvg = `<text 
        x="50%" 
        y="50%" 
        text-anchor="middle" 
        dominant-baseline="central" 
        fill="#${fgColor}" 
        font-family="${fontFamily}"
        font-size="${fontSize}"
        font-weight="500"
        text-transform="uppercase"
      >
        ${name}
      </text>`;
  } else {
    const shapeName = `Shape${shapeKey}` as keyof typeof SHAPES_DATA;
    const shapeData = SHAPES_DATA[shapeName]?.svgContent;

    if (shapeData) {
      // Calculate size and position for the shape
      // Match the calculation used in the React component: Math.round((size) / 100 * 50)
      // Shapes seem designed for a 32x32 internal viewBox
      const shapeRenderSize = Math.round((size / 100) * 50);
      const shapeScale = shapeRenderSize / 32;
      const shapeTranslateX = (size - shapeRenderSize) / 2;
      const shapeTranslateY = (size - shapeRenderSize) / 2;

      // Inject the final color into the shape SVG content
      const coloredShapeData = shapeData.replace(
        /currentColor/g,
        `#${fgColor}`
      );

      contentSvg = `<g transform="translate(${shapeTranslateX} ${shapeTranslateY}) scale(${shapeScale})">
        ${coloredShapeData}
      </g>`;
    }
  }

  const svg = `<svg 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 ${size} ${size}" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect 
      width="100%" 
      height="100%" 
      rx="${bgRx}" 
      ry="${bgRy}" 
      fill="#${bgColor}" 
      ${borderAttrs}
    />
    ${contentSvg}
  </svg>`;

  // Simple minification: remove excessive newlines and whitespace
  return svg.replace(/\n\s*/g, "");
}
