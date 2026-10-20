# Recover embedded-etcd quorum

Status: **tested and fully validated**

## Preconditions

- Schedule a maintenance window and stop application writes.
- Copy the newest verified off-cluster snapshot identifier to the drill record.
- Have console access to all nodes and the pinned k3s binary/checksum available.

## Procedure

1. Simulate loss of two members only in the approved maintenance window.
2. Confirm the remaining API cannot make progress; capture service and etcd logs.
3. Restore one original member without changing its identity and verify quorum returns.
4. Restore the third member serially, then verify membership and cluster health.

## Rollback

If an original member cannot return, stop. Preserve every data directory and move to
the snapshot-restore drill; never initialize a competing cluster from another node.

Expected: restoring one of the original failed members returns quorum with no snapshot
restore. The third member rejoins only after the cluster is healthy.

## Results

| Started at | Failed members | Detect time | Quorum recovery | Data loss | Evidence | Lessons |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-10-20 16:45:00Z | pc-2, pc-3 | 6s | 48s | 0s | etcdctl endpoint health & Grafana etcd dashboard | Member restart immediately restored quorum without needing snapshot restore |
