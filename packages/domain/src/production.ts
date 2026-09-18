import type { DesignId, RevisionId } from "./design";

export type ProductionOutputKind = "FTA" | "ACR" | "TRS";

export interface ProductionOutput {
  kind: ProductionOutputKind;
  designId: DesignId;
  revisionId: RevisionId;
  canonicalGeometryFingerprint: string;
  assetHash: string;
  widthPx: number;
  heightPx: number;
  privateAsset: true;
}

export interface ArtistConstructionReference extends ProductionOutput {
  kind: "ACR";
  handDrawnPresentationRequired: true;
  allowedVisualModes: readonly ["pencil", "graphite", "ink", "professional-sketch"];
}

export interface TransferReadyStencil extends ProductionOutput {
  kind: "TRS";
  physicalWidthMm: number;
  physicalHeightMm: number;
  mirrored: boolean;
  tiled: boolean;
  lineHierarchy: readonly ["primary", "structural", "secondary", "shading-landmark"];
}

export interface ProductionSet {
  designId: DesignId;
  revisionId: RevisionId;
  canonicalGeometryFingerprint: string;
  fta: ProductionOutput & { kind: "FTA" };
  acr: ArtistConstructionReference;
  trs: TransferReadyStencil;
}

export function validateProductionSet(set: ProductionSet): string[] {
  const outputs = [set.fta, set.acr, set.trs];
  const errors: string[] = [];

  for (const output of outputs) {
    if (output.designId !== set.designId) errors.push(`${output.kind}: designId drift`);
    if (output.revisionId !== set.revisionId) errors.push(`${output.kind}: revisionId drift`);
    if (output.canonicalGeometryFingerprint !== set.canonicalGeometryFingerprint) {
      errors.push(`${output.kind}: canonical geometry drift`);
    }
  }

  if (!set.acr.handDrawnPresentationRequired) {
    errors.push("ACR must require hand-drawn presentation");
  }

  return errors;
}
