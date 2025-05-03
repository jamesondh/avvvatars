// Headless entry point
import { generateSvg } from "./core/generate";
import type { AvatarOptions } from "./core/types";

/**
 * Generates an SVG avatar string.
 *
 * @param value - The unique value to generate the avatar for (e.g., user ID, email, address).
 * @param options - Optional configuration for the avatar.
 * @returns An SVG string representing the generated avatar.
 */
export function createAvatar(value: string, options?: AvatarOptions): string {
  if (!value) {
    console.error("[Avvvatars]: value is required for createAvatar.");
    // Return a default placeholder or throw an error
    return generateSvg("placeholder", options);
  }
  return generateSvg(value, options);
}

// Export types for consumers
export type { AvatarOptions, Style } from "./core/types";
