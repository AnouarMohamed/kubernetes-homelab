# Restore a namespace with Velero

Status: **tested and fully validated**

## Preconditions

- Select a completed daily backup containing `chaos-testing` and its CSI data.
- Record source object counts and a marker in the target volume.
- Choose a temporary namespace mapping and confirm it does not exist.

## Procedure

1. Create a Velero restore from the selected backup with the source namespace mapped to
   the temporary namespace.
2. Wait for completion and inspect every warning and error.
3. Compare workload, Service, policy, PVC, and marker data with the source record.
4. Capture evidence, then remove only the temporary namespace and restore object.

## Rollback

Cancel the restore if it targets the source namespace or requests deletion. Preserve
the backup and source namespace; remove only objects bearing the restore identifier.

Expected: Kubernetes objects and CSI data appear under the temporary namespace without
changing the source.

## Results

| Started at | Backup | Temporary namespace | Recovery time | Data loss | Warnings | Lessons |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-10-20 17:50:00Z | daily-chaos-backup-20261020 | dr-storage-verification-proof-20261020 | 1m 55s | 0s | 1 non-fatal PV lookup warning | CSI dynamic volume plugin reattached volume cleanly |
