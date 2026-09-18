# Supabase Development Profile

## Status

**DEVELOPMENT ADAPTER IMPLEMENTED — NO PROJECT PROVISIONED**

Production adoption: **NOT AUTHORIZED**.

## Connected account observation

The connected Supabase account currently exposes **no projects**.

Therefore Phase 1B-I4-I1 implements and verifies the development adapter layer without creating a Supabase project, applying SQL migrations, uploading objects, or creating users.

## Implemented development mapping

| Tattoo Platform contract | Development adapter |
| --- | --- |
| Design Registry | SupabaseDesignRegistryRepository |
| DesignRevision | SupabaseDesignRevisionRepository |
| Canonical snapshot | SupabaseCanonicalSnapshotRepository |
| Asset metadata | SupabaseAssetMetadataRepository |
| Provenance | SupabaseProvenanceRepository |
| Audit | SupabaseAuditEventRepository |
| Retention | SupabaseRetentionRequestRepository |
| Object storage | SupabaseObjectStorageAdapter |
| Identity source mapping | mapSupabaseIdentityToPrincipal |
| Expiring delivery | createSupabaseSignedDelivery |

## Provider gateway strategy

The infrastructure package exposes narrow Supabase-specific data/storage gateway interfaces.

This keeps provider details isolated while allowing later runtime wiring to the official Supabase client after a development project is separately authorized and available.

The current implementation intentionally does not add a live provider SDK dependency because there is no authorized project to connect and no provisioning authority in this work package.

## Safeguards

- Development/test environment only.
- Synthetic fixtures only.
- No real body imagery.
- No real credentials.
- Server secrets rejected in client runtime.
- Security classes map to distinct buckets.
- RESTRICTED_EVIDENCE has the shortest signed-delivery TTL.
- Provider metadata role claims do not grant roles.
- Domain authorization remains authoritative.
- No SQL migration.
- No production project.
- No project creation.
- No deployment.

## Next provider gate

A later separately authorized provider-provisioning gate may:

1. select the Supabase organization;
2. obtain and confirm any project cost;
3. create a dedicated development project;
4. wire the official client to these gateways;
5. define development schema/migrations;
6. run live integration tests and security advisors.

None of those actions are granted by Phase 1B-I4-I1.
