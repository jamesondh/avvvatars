export declare type Style = "character" | "shape";
export interface AvatarOptions {
    style?: Style;
    size?: number;
    displayValue?: string;
    shadow?: boolean;
    border?: boolean;
    borderSize?: number;
    borderColor?: string;
    radius?: number;
}
export interface ResolvedAvatarOptions extends Required<Omit<AvatarOptions, "displayValue">> {
    displayValue?: string;
}
export interface GenerateRandomOptions {
    value: string;
    min: number;
    max: number;
}
export interface ShapeData {
    svgContent: string;
}
