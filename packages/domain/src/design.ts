export type DesignId = string;
export type RevisionId = string;

export type TattooStyle =
  | "black-grey-realism"
  | "color-realism"
  | "fine-line"
  | "traditional"
  | "neo-traditional"
  | "japanese"
  | "illustrative"
  | "geometric"
  | "lettering"
  | "other";

export type Placement =
  | "forearm"
  | "upper-arm"
  | "shoulder"
  | "chest"
  | "back"
  | "thigh"
  | "calf"
  | "wrist"
  | "hand"
  | "sleeve"
  | "other";

export interface PhysicalDimensions {
  widthMm: number;
  heightMm: number;
}

export interface TattooSpecification {
  designId: DesignId;
  revisionId: RevisionId;
  subject: string;
  secondaryElements: string[];
  style: TattooStyle;
  placement: Placement;
  dimensions: PhysicalDimensions;
  colorMode: "black-grey" | "color";
  detail: "low" | "medium" | "high";
  shading: "light" | "medium" | "heavy";
  negativeSpace: "low" | "medium" | "high";
  purpose: "new-tattoo" | "cover-up";
}

export interface CanonicalDesign {
  designId: DesignId;
  revisionId: RevisionId;
  locked: boolean;
  specification: TattooSpecification;
  geometryFingerprint: string;
  compositionFingerprint: string;
  createdAt: string;
}
