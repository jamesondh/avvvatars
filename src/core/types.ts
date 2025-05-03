export type Style = "character" | "shape";

export interface AvatarOptions {
  /** Style of the avatar */
  style?: Style;
  /** Size of the avatar in pixels (used for internal calculations and viewBox) */
  size?: number;
  /** Display value to use instead of the value (e.g., initials) */
  displayValue?: string;
  /** Whether to include a shadow (Note: Not directly supported in SVG, affects container styling if used in DOM) */
  shadow?: boolean;
  /** Whether to include a border */
  border?: boolean;
  /** Border size in pixels */
  borderSize?: number;
  /** Border color (hex code without #) */
  borderColor?: string;
  /** Radius for rounding corners (pixels). Defaults to half of size for a circle. */
  radius?: number;
}

// Internal options after defaults are applied
export interface ResolvedAvatarOptions
  extends Required<Omit<AvatarOptions, "displayValue">> {
  displayValue?: string; // displayValue remains optional
}

export interface GenerateRandomOptions {
  value: string;
  min: number;
  max: number;
}

export interface ShapeData {
  svgContent: string; // The raw <path>, <g>, etc. content for the shape
}
