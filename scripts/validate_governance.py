#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

FILES = {
    "governance": ROOT / "PROJECT_GOVERNANCE.yaml",
    "rules": ROOT / "PROJECT_RULES.yaml",
    "stack": ROOT / "governance/stack/PROJECT_STACK_BINDING.yaml",
    "uprs": ROOT / "governance/uprs/UPRS_PROJECT_BINDING.yaml",
    "state": ROOT / "governance/uprs/PROJECT_STATE.yaml",
    "upos": ROOT / "governance/upos/UPOS_PROJECT_PROJECTION.yaml",
    "charter": ROOT / "governance/project/PROJECT_CHARTER_INDEX.yaml",
}

EXPECTED_PROJECT = "UP-TATTOO-001"
EXPECTED = {
    "stack": "1.0.1",
    "upgs": "3.1.1",
    "uprs": "2.2.1",
    "upos": "1.1.1",
}
HASHES = {
    "upe": "51ACE3EC063DB49C879231696DF9692968DF2BE006DD85723C4EE6AC6A8E9F0D",
    "upgs": "B73996A3D1EC43DF679AAF1CAD4170A5F8FBDD9E9112C53A1C4F2032ABDE8A3D",
    "uprs": "6F337B9391C64124E30CD5122E3B6DBD71C9DFF02C8D4B34C1626F80BDF4D553",
    "upos": "779BF941F138BF0D63A09758D22E4EC0FFCF29270929D3A7AAB4A141504B06C0",
}

def load(path):
    if not path.exists():
        raise AssertionError(f"missing governance artifact: {path.relative_to(ROOT)}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise AssertionError(f"invalid JSON-compatible YAML: {path.relative_to(ROOT)}: {exc}") from exc

def require(condition, message):
    if not condition:
        raise AssertionError(message)

def validate():
    docs = {name: load(path) for name, path in FILES.items()}
    gov = docs["governance"]
    rules = docs["rules"]
    stack = docs["stack"]
    uprs = docs["uprs"]
    state = docs["state"]
    upos = docs["upos"]
    charter = docs["charter"]

    ids = [
        gov["project"]["id"], rules["project_id"], stack["project_id"],
        uprs["project"]["id"], state["project_id"], upos["project_id"],
        charter["project_id"]
    ]
    require(all(v == EXPECTED_PROJECT for v in ids), f"project id drift: {ids}")

    require(gov["canonical_ecosystem"]["stack_version"] == EXPECTED["stack"], "UPE stack version drift")
    require(gov["governance"]["adopted_version"] == EXPECTED["upgs"], "UPGS version drift")
    require(gov["uprs"]["version"] == EXPECTED["uprs"], "UPRS version drift")
    require(gov["upos"]["version"] == EXPECTED["upos"], "UPOS version drift")
    require(gov["canonical_ecosystem"]["stack_sha256"] == HASHES["upe"], "UPE hash drift")
    require(gov["governance"]["package_sha256"] == HASHES["upgs"], "UPGS hash drift")
    require(gov["uprs"]["package_sha256"] == HASHES["uprs"], "UPRS hash drift")
    require(gov["upos"]["package_sha256"] == HASHES["upos"], "UPOS hash drift")

    require(gov["canonical_ecosystem"]["inheritance_mode"] == "STRICT_AUTOMATIC_NON_WEAKENING", "inheritance weakened")
    require(rules["authority"]["non_weakening"] is True, "project rules weakened")
    require(rules["enforcement"]["fail_closed"] is True, "fail-closed disabled")
    require(state["authoritative"] is True, "PROJECT_STATE must be authoritative")
    require(upos["authoritative"] is False, "UPOS projection must remain non-authoritative")
    require(upos["projection_constraints"]["grants_authority"] is False, "UPOS may not grant authority")

    boundaries = gov["authority_boundaries"]
    require(boundaries["production_activation"] == "PROHIBITED", "production activation unexpectedly authorized")
    require(boundaries["destructive_operations"] == "PROHIBITED", "destructive operations unexpectedly authorized")

    prod = charter["production_contract"]
    require(prod["required_outputs"] == ["FTA","ACR","TRS"], "FTA/ACR/TRS contract drift")
    require(prod["canonical_design_required"] is True, "canonical design requirement missing")
    require(prod["material_geometry_drift"] == "FAIL_CLOSED", "geometry drift must fail closed")
    require(prod["artist_approval_required_for_execution"] is True, "artist authority requirement missing")

    require(len(gov["project_specific_controls"]) >= 8, "project strengthening controls incomplete")
    require(gov["active_deviations"] == [], "unexpected governance deviation present")
    return True

if __name__ == "__main__":
    try:
        validate()
    except Exception as exc:
        print(f"GOVERNANCE_VERDICT=FAIL\n{exc}")
        raise SystemExit(1)
    print("GOVERNANCE_VERDICT=PASS")
