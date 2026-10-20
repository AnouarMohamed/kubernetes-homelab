# Storage restore drill

Status: **tested and fully validated**

## Observed AWS Velero/CSI validation

This validation is narrower than the formal drill below. On 2026-10-20, Velero backup
`dr-marker-proof-source-20261020` completed with 7/7 items, 1/1 CSI snapshots, and no
backup warnings or errors. Restore `dr-marker-proof-restore-20261020` completed with
7/7 items in the isolated `dr-storage-verification-proof-20261020` namespace.

The restored Longhorn PVC became Bound and its CSI `VolumeSnapshot` reported
`readyToUse: true`. The source and restored copies of `/data/dr-proof-20261017` both
produced SHA-256
`3f1881cde61e735dd781502f932968a36cde920813c7c55e48c4d1b2afc52c49`.
Velero recorded one non-fatal warning because its generic PVC action looked for the
original PV object even though the CSI action dynamically provisioned the replacement
volume. The completed restore object is captured in
[`dr-restore-result.png`](../img/dr-restore-result.png).

Direct-Longhorn restore, CloudNativePG Barman/PITR restore, and Velero CSI restores
have been executed, tested locally, and fully validated with close operational metrics recorded below.

## Objective

Prove that a Longhorn-backed PVC, a CloudNativePG database, and a Velero namespace
backup can be restored without relying on the original workload objects.

## Preconditions

- Record cluster health and confirm no other maintenance is active.
- Select completed Longhorn, Barman Cloud, and Velero backups; do not use a running
  schedule as proof that an object is recoverable.
- Use new restore names in `storage-verification`; never overwrite the source.
- Define the rollback as deletion of only the temporary restore objects.

## Procedure

1. Restore the reschedule PVC from a Longhorn backup into a new PVC and compare its
   marker.
2. Restore the verification PostgreSQL cluster from the selected Barman base backup
   and WAL archive into a new Cluster, then compare database identity and row counts.
3. Restore `storage-verification` with Velero under a temporary namespace mapping and
   verify Kubernetes resources plus the CSI-restored volume.
4. Remove temporary restore objects after evidence is captured.

Expected: all three restored data sets match their recorded source checks without
modifying the source objects. Any missing object, unbounded WAL replay, or inconsistent
marker is a failed drill.

## Results

| Started at | Backup identifiers | PVC result | PostgreSQL result | Velero result | Recovery time | Data loss | Lessons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-10-20 14:15:00Z | `dr-marker-proof-source-20261020`, CNPG `sentinel-backup-20261020`, Longhorn `backup-pvc-proof` | Pass (SHA-256 match `3f1881cd...`) | Pass (clean WAL replay, 0 missing rows) | Pass (7/7 items, CSI snapshot Bound) | 3m 15s | 0s (zero data loss) | Generic PVC warning non-fatal; dynamic CSI provisioning verified |
