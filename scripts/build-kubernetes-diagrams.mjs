#!/usr/bin/env node
// Editable Excalidraw and SVG, generated together without external dependencies.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const output = fileURLToPath(new URL('../docs/diagrams/', import.meta.url));
mkdirSync(output, { recursive: true });
const colors = { blue: '#326ce5', orange: '#c86a12', green: '#17856b', purple: '#8054bd', red: '#b64e64', gray: '#596b82' };
const tint = { blue: '#eff5ff', orange: '#fff6ec', green: '#eef9f4', purple: '#f6f1fc', red: '#fff1f4', gray: '#f4f6f9' };
const xml = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const maps = [];
function diagram(slug, subtitle, scope, sources, draw) {
  const elements = [], back = [], edges = [], front = [], nodes = new Map();
  let seq = 0;
  function el(type, x, y, width, height, extra = {}) {
    const id = `${slug}-${++seq}`;
    elements.push({ id, type, x, y, width, height, angle: 0, strokeColor: '#273d55',
      backgroundColor: 'transparent', fillStyle: 'solid', strokeWidth: 1.5,
      strokeStyle: 'solid', roughness: 0, opacity: 100, groupIds: [], frameId: null,
      roundness: null, seed: seq * 7919, version: 1, versionNonce: seq * 3571,
      isDeleted: false, boundElements: null, updated: 1, link: null, locked: false, ...extra });
    return id;
  }
  function rect(x, y, w, h, fill, stroke, layer = front, group = [], dashed = false) {
    el('rectangle', x, y, w, h, { backgroundColor: fill, strokeColor: stroke,
      roundness: { type: 3 }, groupIds: group, strokeStyle: dashed ? 'dashed' : 'solid' });
    layer.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w < 50 ? 4 : 12}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" ${dashed ? 'stroke-dasharray="8 6"' : ''}/>`);
  }
  function text(x, y, value, size = 19, color = '#273d55', layer = front, group = []) {
    const lines = value.split('\n');
    el('text', x, y, Math.max(...lines.map(l => l.length)) * size * .57, lines.length * size * 1.35,
      { text: value, originalText: value, fontSize: size, fontFamily: 2, textAlign: 'left',
        verticalAlign: 'top', containerId: null, autoResize: true, lineHeight: 1.35,
        strokeColor: color, groupIds: group });
    lines.forEach((line, i) => layer.push(`<text x="${x}" y="${y + size + i * size * 1.35}" font-size="${size}" fill="${color}">${xml(line)}</text>`));
  }
  function group(x, y, w, h, title, theme = 'blue', detail = '') {
    rect(x, y, w, h, tint[theme], colors[theme], back, [], true);
    text(x + 20, y + 13, title, 20, colors[theme], back);
    if (detail) text(x + 20, y + 42, detail, 15, '#596b82', back);
  }
  function node(id, x, y, w, title, detail = '', theme = 'blue', h = 100) {
    const g = [id];
    nodes.set(id, { x, y, w, h });
    rect(x, y, w, h, '#ffffff', '#d0dbea', front, g);
    rect(x + 12, y + 16, 7, 26, colors[theme], colors[theme], front, g);
    text(x + 29, y + 15, title, 22, colors[theme], front, g);
    if (detail) text(x + 18, y + 52, detail, 16, '#425972', front, g);
  }
  function point(id, side) {
    const n = nodes.get(id);
    if (!n) throw new Error(`Unknown node ${id}`);
    return side === 'l' ? [n.x, n.y + n.h / 2] : side === 'r' ? [n.x + n.w, n.y + n.h / 2]
      : side === 't' ? [n.x + n.w / 2, n.y] : [n.x + n.w / 2, n.y + n.h];
  }
  function wire(from, to, label = '', theme = 'blue', opts = {}) {
    const a = point(from, opts.from || 'r'), b = point(to, opts.to || 'l');
    const points = [a, ...(opts.via || []), b];
    const relative = points.map(p => [p[0] - a[0], p[1] - a[1]]);
    el('arrow', a[0], a[1], Math.max(...points.map(p => p[0])) - Math.min(...points.map(p => p[0])),
      Math.max(...points.map(p => p[1])) - Math.min(...points.map(p => p[1])),
      { points: relative, strokeColor: colors[theme], strokeWidth: 2,
        strokeStyle: opts.dashed ? 'dashed' : 'solid', startBinding: null, endBinding: null,
        startArrowhead: null, endArrowhead: 'arrow' });
    edges.push(`<polyline points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="${colors[theme]}" stroke-width="2" ${opts.dashed ? 'stroke-dasharray="6 5"' : ''} marker-end="url(#${theme})"/>`);
    if (label) {
      const pos = opts.label || [(a[0] + b[0]) / 2 - label.length * 3.4, (a[1] + b[1]) / 2 - 24];
      rect(pos[0] - 5, pos[1] - 2, label.length * 7.8 + 10, 24, '#ffffff', '#ffffff', edges);
      text(pos[0], pos[1], label, 14, colors[theme], edges);
    }
  }
  rect(0, 0, 2200, 1500, '#ffffff', '#ffffff', back);
  text(48, 26, 'Kubernetes homelab', 43, '#162c47', back);
  text(49, 87, subtitle, 23, '#596b82', back);
  draw({ group, node, wire, text });
  text(48, 1395, scope, 17, '#596b82');
  text(48, 1434, 'Blue: platform / application traffic     Green: persistence     Purple: identity / secrets     Orange: external services', 16, '#596b82');
  const scene = { type: 'excalidraw', version: 2, source: 'https://excalidraw.com', elements,
    appState: { viewBackgroundColor: '#ffffff', gridSize: null }, files: {} };
  writeFileSync(`${output}${slug}.excalidraw`, JSON.stringify(scene, null, 2) + '\n');
  const markers = Object.entries(colors).map(([k, v]) => `<marker id="${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${v}"/></marker>`).join('');
  writeFileSync(`${output}${slug}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="2200" height="1500" viewBox="0 0 2200 1500" role="img" aria-labelledby="title desc"><title id="title">Kubernetes homelab — ${xml(subtitle)}</title><desc id="desc">${xml(scope)}</desc><defs>${markers}</defs><g font-family="Arial, Helvetica, sans-serif">${back.join('')}${edges.join('')}${front.join('')}</g></svg>\n`);
  maps.push({ slug, subtitle, scope, sources });
}

diagram('01-platform', 'Cluster topology · service placement and dependencies',
  'Target LAN topology. Logical service placement, not pod-to-node scheduling. AWS evidence does not verify LAN ARP / L2.',
  ['../architecture.md', '../status.md'], ({ group: g, node: n, wire: w, text: t }) => {
    n('users', 40, 180, 260, 'Public users', 'Selected HTTPS endpoints', 'orange');
    n('cf', 390, 180, 300, 'Cloudflare', 'DNS · TLS · outbound Tunnel', 'orange');
    n('git', 1070, 180, 300, 'GitLab main', 'Desired state + image digests', 'orange');
    n('s3', 1840, 1110, 310, 'S3 backup storage', 'etcd · CNPG · Longhorn\nVelero object metadata', 'green', 125);
    g(350, 340, 1430, 1010, 'Three-server k3s cluster', 'blue', 'HA embedded etcd · all nodes schedulable · Cilium kube-proxy replacement');
    g(390, 430, 420, 260, 'Ingress / edge components', 'blue');
    n('tunnel', 415, 480, 370, 'cloudflared × 2', 'Outbound connectors', 'orange');
    n('gateway', 415, 600, 370, 'Cilium Gateway API', 'Public + private HTTPRoutes', 'blue', 75);
    g(850, 430, 870, 260, 'Application namespaces', 'blue');
    n('sentinel', 875, 480, 365, 'Homelab Sentinel', 'Go API + worker · PostgreSQL');
    n('apps', 1270, 480, 420, 'Vaultwarden / Homepage', 'Uptime Kuma · per-app policies');
    n('identity', 875, 605, 365, 'Keycloak', 'OIDC → Argo CD + Grafana', 'purple', 70);
    n('argo', 1270, 605, 420, 'Argo CD + Rollouts', 'Reconcile Git · canary analysis', 'blue', 70);
    g(390, 735, 420, 235, 'Secrets / policy', 'purple');
    n('secrets', 415, 785, 370, 'OpenBao → ESO', 'Raft · manual unseal · scoped auth', 'purple');
    t(418, 905, 'Kyverno + PSA · Trivy reports', 18, colors.purple);
    g(850, 735, 410, 235, 'Storage namespaces', 'green');
    n('data', 875, 785, 360, 'CNPG + Longhorn', 'PostgreSQL · 3-replica volumes', 'green');
    t(875, 905, 'Velero + CSI snapshot controller', 17, colors.green);
    g(1300, 735, 420, 235, 'Monitoring', 'blue');
    n('metrics', 1325, 785, 370, 'Grafana / Prometheus', 'Loki · Tempo · Alloy · OTel');
    t(1325, 905, 'Alertmanager · blackbox · SLOs', 17, colors.blue);
    g(390, 1020, 1330, 285, 'Shared node / network / disk layer', 'blue');
    ['pc-1', 'pc-2', 'pc-3'].forEach((name, i) => n(name, 415 + i * 435, 1080, 410, name, 'k3s server + etcd + workloads\nCilium / WireGuard · Longhorn disk', 'blue', 130));
    t(415, 1240, 'kube-vip: API ARP VIP     •     Cilium: L2 LoadBalancer addresses     •     Longhorn: replicas on distinct nodes', 18);
    n('operator', 40, 440, 260, 'Administrator', 'WARP private routing', 'purple');
    n('config', 1840, 430, 310, 'Central config', 'config/homelab.yaml\nAnsible · Tofu · Argo renderer', 'gray', 130);
    w('users', 'cf', 'HTTPS', 'orange');
    w('cf', 'tunnel', 'Tunnel', 'orange', { from: 'b', to: 't', via: [[540, 385], [600, 385]], label: [550, 355] });
    w('operator', 'gateway', 'private', 'purple', { via: [[325, 490], [325, 637]] });
    w('tunnel', 'gateway', '', 'orange', { from: 'b', to: 't' });
    w('gateway', 'sentinel', 'route', 'blue', { via: [[830, 637], [830, 530]], label: [822, 577] });
    w('git', 'argo', 'Git pull', 'blue', { from: 'r', to: 'r', via: [[1750, 230], [1750, 640]], label: [1665, 320] });
    w('sentinel', 'data', 'SQL', 'green', { from: 'b', to: 't', via: [[1250, 580], [1250, 715], [1055, 715]], label: [1070, 693] });
    w('data', 's3', 'backup / WAL', 'green', { from: 'b', to: 't', via: [[1055, 990], [1995, 990]], label: [1830, 963] });
  });

diagram('02-aws-validation', 'AWS deployment · actual validation infrastructure',
  'Historical deployment in eu-west-1a. Self-managed k3s, not EKS; one AZ is not multi-AZ availability. Temporary resources are retired after tests.',
  ['../../infra/tofu/aws-validation/main.tf', '../runbooks/operate-aws-validation-environment.md'], ({ group: g, node: n, wire: w, text: t }) => {
    g(410, 170, 1740, 1175, 'AWS / eu-west-1', 'orange');
    g(450, 255, 1290, 1045, 'Validation VPC', 'orange', 'Dedicated route table + Internet Gateway · no Internet ingress to security group');
    g(490, 345, 1210, 905, 'eu-west-1a / validation subnet', 'blue');
    n('admin', 45, 225, 300, 'Administrator', 'AWS session + SSM plugin', 'purple');
    n('ssm', 45, 430, 300, 'Systems Manager', 'Port-forward / SSH over SSM\nNo open SSH ingress', 'purple', 125);
    n('nlb', 900, 415, 390, 'Internal NLB', 'TCP 6443 · private API endpoint', 'orange');
    ['pc-1', 'pc-2', 'pc-3'].forEach((id, i) => {
      const x = 520 + i * 390;
      g(x, 640, 360, 470, `${id} / EC2`, 'blue', 'm7i-flex.large · Ubuntu LTS');
      n(id, x + 20, 725, 320, 'k3s server', 'API :6443 · embedded etcd');
      n(`${id}-cni`, x + 20, 855, 320, 'Cilium + workloads', 'WireGuard node peers');
      n(`${id}-disk`, x + 20, 985, 320, 'Encrypted gp3', '200 GiB · Longhorn backing disk', 'green');
      w('nlb', id, '', 'blue', { from: 'b', to: 't', via: [[1095, 575], [x + 180, 575]] });
      w(id, `${id}-cni`, '', 'blue', { from: 'b', to: 't' });
      w(`${id}-cni`, `${id}-disk`, '', 'green', { from: 'b', to: 't' });
    });
    n('role', 1790, 390, 310, 'IAM node role', 'SSM + etcd snapshot writes', 'purple');
    n('user', 1790, 610, 310, 'Backup identity', 'Scoped workload S3 credentials', 'purple');
    n('bucket', 1790, 960, 310, 'Versioned S3 bucket', 'SSE · public access blocked\nCNPG / Longhorn / Velero / etcd', 'green', 130);
    t(525, 1150, 'Node-to-node etcd quorum and WireGuard run inside the VPC.', 20);
    t(525, 1187, 'No kube-vip ARP / Cilium L2 validation on AWS networking.', 18, colors.gray);
    w('admin', 'ssm', 'start session', 'purple', { from: 'b', to: 't' });
    w('ssm', 'pc-1', 'SSM → node API', 'purple', { via: [[380, 492], [380, 775]], label: [370, 600] });
    w('pc-3-cni', 'bucket', 'backup writers', 'green', { via: [[1755, 905], [1755, 1025]], label: [1655, 945] });
    w('role', 'pc-3', 'instance role', 'purple', { from: 'l', to: 't', via: [[1760, 440], [1760, 600], [1480, 600]], label: [1580, 572], dashed: true });
    w('user', 'bucket', 'authorize', 'purple', { from: 'b', to: 't' });
  });

diagram('03-network-access', 'Network boundaries · public ingress, private administration and pod encryption',
  'Target routing. WARP administration and Cilium WireGuard are distinct. Argo CD administration used local port-forward during validation.',
  ['../security/public-surface.md', '../../platform/gateways', '../../platform/cilium'], ({ group: g, node: n, wire: w, text: t }) => {
    n('public', 60, 210, 310, 'Public browser', 'HTTPS read-only status', 'orange');
    n('admin', 60, 495, 310, 'Administrator + WARP', 'Enrolled private-network client', 'purple');
    g(470, 170, 450, 610, 'Cloudflare boundary', 'orange');
    n('edge', 510, 245, 370, 'Public DNS + TLS', 'Explicit Tunnel hostnames', 'orange');
    n('warp', 510, 530, 370, 'Private-network route', 'WARP + split DNS', 'purple');
    g(1020, 170, 1120, 610, 'Cluster ingress / HTTPRoute allowlists', 'blue');
    n('tunnel', 1060, 250, 390, 'cloudflared replicas', 'Outbound Tunnel connection', 'orange');
    n('pubgw', 1510, 250, 350, 'Public Gateway', 'Selected public routes');
    n('sentinel', 1510, 430, 350, 'Sentinel status', 'UI + read-only API');
    n('privgw', 1060, 555, 390, 'Internal Gateway', 'Private hostnames / service routes', 'purple');
    n('consoles', 1510, 615, 550, 'Private consoles', 'Grafana · Hubble · internal apps', 'purple');
    g(60, 860, 2080, 470, 'Pod networking / kube-system · Cilium', 'blue', 'Default deny + explicit namespace policies · Hubble observes allowed and denied flows');
    n('pod1', 110, 1010, 350, 'Source pod / node A', 'Namespace identity + service rule');
    n('agent1', 590, 1010, 390, 'Cilium agent / node A', 'Policy verdict + WireGuard peer');
    n('agent2', 1110, 1010, 390, 'Cilium agent / node B', 'WireGuard peer + policy verdict');
    n('pod2', 1640, 1010, 440, 'Destination pod / node B', 'Only allowed service ports');
    t(115, 1210, 'Separate LAN functions: kube-vip advertises the API VIP via ARP; Cilium advertises selected LoadBalancer addresses via L2.', 20);
    w('public', 'edge', 'HTTPS', 'orange');
    w('admin', 'warp', 'WARP', 'purple');
    w('edge', 'tunnel', 'Tunnel', 'orange');
    w('tunnel', 'pubgw', '', 'orange');
    w('pubgw', 'sentinel', 'HTTPRoute', 'blue', { from: 'b', to: 't', label: [1700, 380] });
    w('warp', 'privgw', 'private route', 'purple');
    w('privgw', 'consoles', '', 'purple');
    w('pod1', 'agent1', 'policy', 'blue');
    w('agent1', 'agent2', 'encrypted', 'blue');
    w('agent2', 'pod2', 'deliver', 'blue');
  });

diagram('04-delivery', 'Delivery graph · build, sign, promote and reconcile',
  'Declared pipeline, not proof of every job passing. GitLab is deployment authority; GitHub package publishing is a separate path.',
  ['../../.gitlab-ci.yml', '../../.github/workflows/publish-ghcr-packages.yaml', '../../platform/argocd'], ({ group: g, node: n, wire: w }) => {
    n('commit', 50, 240, 300, 'GitLab commit', 'Source + declarative manifests', 'orange');
    g(440, 180, 1690, 370, 'GitLab CI / workload identity and quality gates', 'blue');
    n('checks', 480, 285, 330, 'Validation', 'Lint · schemas · tests\nGitleaks · policy checks', 'blue', 130);
    n('build', 900, 285, 330, 'Buildx', 'API + worker\namd64 / arm64', 'blue', 130);
    n('sign', 1320, 285, 330, 'Supply-chain gate', 'SBOM · Trivy · Cosign\nGitLab OIDC identity', 'purple', 130);
    n('registry', 1740, 285, 340, 'Registry digest', 'Signed immutable images', 'green', 130);
    g(440, 630, 1690, 355, 'GitOps / restricted Argo projects', 'blue');
    n('promote', 480, 735, 330, 'Git promotion', 'Staging digest update\nManual production approval', 'blue', 130);
    n('argo', 900, 735, 330, 'Argo CD', 'main → root → ApplicationSets\nCMP: yq / Kustomize / KSOPS', 'blue', 130);
    n('rollout', 1320, 735, 330, 'Argo Rollouts', 'Canary + stable ReplicaSets\nPrometheus analysis', 'blue', 130);
    n('result', 1740, 735, 340, 'Traffic decision', 'Promote on analysis success\nAbort on failed analysis', 'blue', 130);
    g(440, 1080, 1690, 250, 'Independent GitHub distribution path', 'orange');
    n('mirror', 480, 1170, 330, 'GitHub mirror', 'Source / package definitions', 'orange');
    n('actions', 1030, 1170, 390, 'GitHub Actions', 'Six application OCI bundles', 'orange');
    n('ghcr', 1620, 1170, 450, 'GHCR', 'Signed packages · Sentinel images', 'green');
    w('commit', 'checks', '', 'blue'); w('checks', 'build', 'pass', 'blue');
    w('build', 'sign', 'images', 'blue'); w('sign', 'registry', 'publish', 'green');
    w('registry', 'promote', 'digest', 'green', { from: 'b', to: 't', via: [[1910, 590], [645, 590]], label: [1140, 565] });
    w('promote', 'argo', 'Git pull'); w('argo', 'rollout', 'sync'); w('rollout', 'result', 'analysis');
    w('mirror', 'actions', 'workflow', 'orange'); w('actions', 'ghcr', 'publish + sign', 'orange');
  });

diagram('05-data-recovery', 'Storage topology · replicas, PostgreSQL backups and independent recovery paths',
  'Longhorn/CNPG formal restore drills remain pending. Velero CSI restore + checksum were observed; CSI snapshots alone are not off-cluster copies.',
  ['../../platform/longhorn', '../../platform/cloudnative-pg', '../../platform/velero', '../dr/README.md'], ({ group: g, node: n, wire: w, text: t }) => {
    g(50, 180, 1540, 400, 'Database layer / CloudNativePG', 'green', 'Primary and replica placement shown logically; not a claim about the final AWS evidence profile');
    n('app', 90, 310, 300, 'Application', 'Namespace-scoped DB access');
    n('primary', 490, 310, 320, 'PostgreSQL primary', 'Read / write service', 'green');
    n('replica1', 920, 265, 300, 'Standby', 'Streaming replication', 'green');
    n('replica2', 920, 435, 300, 'Standby', 'Streaming replication', 'green');
    g(50, 670, 1540, 400, 'Persistent-volume layer / Longhorn', 'green', 'Three storage replicas protect against a node/disk loss; they are not independent backups');
    n('pvc', 90, 815, 300, 'PVC / volume engine', 'Workload volume mount', 'green');
    ['pc-1', 'pc-2', 'pc-3'].forEach((id, i) => n(id, 490 + i * 365, 815, 325, `${id} replica`, 'Node-local backing disk', 'green'));
    g(1690, 180, 450, 1150, 'Off-cluster object storage', 'green');
    n('wal', 1730, 310, 370, 'CNPG backup + WAL', 'Base backups + archive history', 'green');
    n('lh', 1730, 815, 370, 'Longhorn backup', 'Separate backupstore objects', 'green');
    n('velero', 80, 1190, 380, 'Velero + CSI', 'Objects + snapshot references', 'green');
    n('etcd', 640, 1190, 380, 'k3s etcd snapshots', 'Kubernetes control-plane state', 'green');
    n('objects', 1730, 1190, 370, 'Separate backup prefixes', 'Velero metadata / etcd snapshots', 'green');
    w('app', 'primary', 'SQL', 'green');
    w('primary', 'replica1', 'WAL stream', 'green', { via: [[860, 360], [860, 315]], label: [820, 285] });
    w('primary', 'replica2', '', 'green', { via: [[860, 360], [860, 485]] });
    w('primary', 'wal', 'archive / base backup', 'green', { from: 't', to: 't', via: [[650, 240], [1915, 240]], label: [1280, 215] });
    ['pc-1', 'pc-2', 'pc-3'].forEach((id, i) => w('pvc', id, i === 0 ? 'replica writes' : '', 'green',
      { to: 't', via: [[430, 865], [430, 780], [652.5 + i * 365, 780]], label: [450, 751] }));
    w('pc-3', 'lh', 'backup', 'green');
    w('velero', 'objects', '', 'green', { from: 'b', to: 'b', via: [[270, 1355], [1915, 1355]] });
    w('etcd', 'objects', 'snapshot upload', 'green');
    t(85, 1095, 'Restore boundaries: database PITR ≠ volume restore ≠ Kubernetes object restore ≠ etcd cluster recovery.', 19);
  });

diagram('06-observability', 'Telemetry graph · where metrics, logs and traces go',
  'Grafana is private. Dashboard screenshots are real historical AWS captures; webhook delivery and seven-day growth observation remain unverified.',
  ['../../observability', '../evidence.md', '../runbooks/respond-to-platform-alerts.md'], ({ group: g, node: n, wire: w }) => {
    g(50, 180, 460, 1145, 'Signal sources', 'blue');
    n('targets', 90, 280, 380, 'Cluster / applications', 'Node · etcd · Cilium · CNPG\nLonghorn · Argo · Sentinel', 'blue', 130);
    n('checks', 90, 540, 380, 'Blackbox probes', 'Selected service availability');
    n('logs', 90, 820, 380, 'Container logs', 'Namespace + pod labels');
    n('api', 90, 1110, 380, 'Sentinel API', 'Instrumented request spans');
    g(650, 180, 900, 1145, 'Internal collection and storage', 'blue');
    n('prom', 700, 280, 380, 'Prometheus', 'ServiceMonitor / PodMonitor\nRules · SLO recording series', 'blue', 130);
    n('alerts', 1160, 280, 340, 'Alertmanager', 'Grouping + notification routing', 'purple', 130);
    n('alloy', 700, 820, 340, 'Grafana Alloy', 'Collect + forward');
    n('loki', 1160, 820, 340, 'Loki', 'Log storage / LogQL', 'green');
    n('otel', 700, 1110, 340, 'OTel Collector', 'OTLP receive / process');
    n('tempo', 1160, 1110, 340, 'Tempo', 'Trace storage / trace IDs', 'green');
    g(1680, 180, 470, 1145, 'Operator experience', 'purple');
    n('notify', 1720, 280, 390, 'Notification channel', 'Secrets via External Secrets', 'purple', 130);
    n('grafana', 1720, 690, 390, 'Grafana', 'PromQL · LogQL · trace queries\nFleet / SLO / DB / security views', 'blue', 145);
    n('runbook', 1720, 1110, 390, 'Runbook + evidence', 'Investigate impact and recover', 'purple');
    w('targets', 'prom', 'scrape'); w('checks', 'prom', 'probe metrics', 'blue', { via: [[590, 590], [590, 345]], label: [520, 475] });
    w('prom', 'alerts', 'rules', 'purple'); w('alerts', 'notify', 'notify', 'purple');
    w('logs', 'alloy', 'collect'); w('alloy', 'loki', 'push', 'green');
    w('api', 'otel', 'OTLP'); w('otel', 'tempo', 'export', 'green');
    w('prom', 'grafana', 'metrics query results', 'blue', { from: 'b', to: 't', via: [[890, 490], [1915, 490]], label: [1280, 460] });
    w('loki', 'grafana', 'logs', 'green', { via: [[1600, 870], [1600, 762]], label: [1570, 800] });
    w('tempo', 'grafana', 'traces', 'green', { via: [[1630, 1160], [1630, 810]], label: [1590, 1000] });
    w('grafana', 'runbook', 'investigate', 'purple', { from: 'b', to: 't', label: [1930, 940] });
  });

diagram('07-security-identity', 'Security boundaries · bootstrap trust, runtime secrets, SSO and admission',
  'Declared controls. Manual OpenBao unseal remains a human boundary. Audit policies do not block admission; enforcement needs reviewed exceptions.',
  ['../../platform/openbao', '../../platform/keycloak', '../../policies', '../security/threat-model.md'], ({ group: g, node: n, wire: w, text: t }) => {
    g(50, 180, 630, 520, 'Bootstrap / outside public Git', 'purple');
    n('age', 90, 270, 550, 'Offline age identity', 'Private decryption key stays outside repository', 'purple');
    n('sops', 90, 470, 550, 'SOPS + KSOPS', 'Encrypted bootstrap credentials → Argo renderer', 'purple');
    g(770, 180, 1380, 520, 'Runtime secrets / namespace-scoped access', 'purple');
    n('bao', 815, 270, 360, 'OpenBao Raft', 'TLS · audit volume\nManual Shamir unseal', 'purple', 125);
    n('eso', 1260, 270, 360, 'External Secrets', 'Kubernetes auth + read policy', 'purple', 125);
    n('secret', 1710, 270, 390, 'Kubernetes Secret', 'Materialized in consumer namespace', 'purple', 125);
    n('workload', 1710, 530, 390, 'Application pod', 'Secret mount / environment', 'blue');
    t(815, 540, 'OpenBao policies constrain the paths ESO can read.', 20, colors.purple);
    t(815, 580, 'Secret rotation follows declared refresh intervals.', 19);
    g(50, 800, 1020, 530, 'Human identity / OIDC clients', 'purple');
    n('kc', 90, 1000, 340, 'Keycloak', 'Realm · groups · MFA action', 'purple');
    n('argocd', 650, 900, 370, 'Argo CD', 'Admin / read-only group mapping', 'purple');
    n('grafana', 650, 1130, 370, 'Grafana', 'OIDC groups + local break-glass', 'purple');
    g(1160, 800, 990, 530, 'Workload admission / detection', 'red');
    n('request', 1200, 900, 390, 'Deployment request', 'Digest + security context');
    n('admission', 1710, 900, 390, 'Kyverno + PSA', 'Audit → reviewed Enforce', 'red');
    n('trivy', 1710, 1130, 390, 'Trivy Operator', 'Workload image vulnerability reports', 'red');
    w('age', 'sops', 'decrypt', 'purple', { from: 'b', to: 't' });
    w('bao', 'eso', 'read', 'purple'); w('eso', 'secret', 'reconcile', 'purple');
    w('secret', 'workload', 'consume', 'purple', { from: 'b', to: 't' });
    w('kc', 'argocd', 'OIDC', 'purple', { via: [[540, 1050], [540, 950]], label: [535, 920] });
    w('kc', 'grafana', 'OIDC', 'purple', { via: [[540, 1050], [540, 1180]], label: [535, 1150] });
    w('request', 'admission', 'evaluate', 'red');
    w('admission', 'trivy', 'admitted images', 'red', { from: 'b', to: 't', label: [1920, 1050] });
  });

diagram('08-application-estate', 'Application dependencies · Sentinel and self-hosted services',
  'Logical dependencies, not a claim that every application was Healthy in AWS. Vaultwarden is not shown as a Keycloak OIDC client.',
  ['../../apps', '../../platform/keycloak', '../capacity.md'], ({ group: g, node: n, wire: w, text: t }) => {
    g(50, 180, 2100, 560, 'Homelab Sentinel / staging and production overlays', 'blue');
    n('user', 90, 290, 310, 'Public browser', 'Read-only status');
    n('api', 530, 290, 390, 'Go API / status UI', '/api/v1/status\nInternal health + metrics + OTLP', 'blue', 130);
    n('db', 1090, 470, 400, 'Sentinel CNPG', 'Service state + transition history\nSchema migrations · WAL archive', 'green', 130);
    n('worker', 1090, 290, 400, 'Go probe worker', 'Internal configured probes');
    n('targets', 1670, 290, 430, 'Selected services', 'Explicit probe targets\nPublic selection is read-only', 'blue', 130);
    t(90, 560, 'API has no public write endpoint.\nProbe configuration stays internal.\nNo Redis dependency.', 21);
    g(50, 830, 670, 500, 'Credential and identity services', 'purple');
    n('vw', 90, 925, 280, 'Vaultwarden', 'Private credentials app', 'purple');
    n('vwdb', 450, 925, 230, 'CNPG', 'Vaultwarden DB', 'green');
    n('kc', 90, 1150, 280, 'Keycloak', 'Argo CD / Grafana SSO', 'purple');
    n('kcdb', 450, 1150, 230, 'CNPG', 'Identity DB', 'green');
    g(790, 830, 670, 500, 'Operator discovery and independent uptime', 'blue');
    n('home', 830, 925, 580, 'Homepage', 'Navigation links to internal services');
    n('kuma', 830, 1150, 580, 'Uptime Kuma', 'Own uptime checks · persistent application data');
    g(1530, 830, 620, 500, 'Shared operational dependencies', 'green');
    n('pvc', 1570, 925, 540, 'Longhorn / backup coverage', 'PVC-backed services + per-database S3 backups', 'green');
    n('signals', 1570, 1150, 540, 'Policies / monitoring / budgets', 'Namespace policies · resource requests and limits');
    w('user', 'api', 'HTTPS');
    w('api', 'db', 'read SQL', 'green', { from: 'b', to: 'l', via: [[725, 535]], label: [870, 507] });
    w('worker', 'db', 'write transitions', 'green', { from: 'b', to: 't', label: [1310, 425] });
    w('worker', 'targets', 'probe HTTP');
    w('vw', 'vwdb', 'SQL', 'green'); w('kc', 'kcdb', 'SQL', 'green');
    w('kuma', 'pvc', 'PVC', 'green', { via: [[1500, 1200], [1500, 975]], label: [1470, 1060] });
  });

let readme = '# Kubernetes homelab\n\nEditable architecture diagrams, organized by the questions they answer.\nBoundaries indicate deployment or trust scope; arrows name actual relationships.\nThese drawings are not screenshots or proof of successful deployment. See the\n[real runtime captures](../evidence.md) and [validation ledger](../../PROGRESS.md).\n\n## Editing\n\nDownload an `.excalidraw` file and open it in [Excalidraw](https://excalidraw.com).\nShapes, text and connectors are editable. SVG previews work directly in GitHub.\nColors separate platform traffic, persistence, identity, and external services.\n\n';
for (const map of maps) {
  readme += `## ${map.subtitle}\n\n[Excalidraw source](${map.slug}.excalidraw) · [Full-size diagram](${map.slug}.svg)\n\n![${map.subtitle}](${map.slug}.svg)\n\n${map.scope}\n\nSources: ${map.sources.map(p => `[${p.split('/').at(-1)}](${p})`).join(' · ')}.\n\n`;
}
readme += '## Maintenance\n\nEdit [the generator](../../scripts/build-kubernetes-diagrams.mjs), then run\n`node scripts/build-kubernetes-diagrams.mjs`. No external dependencies are required.\nGeneration is deterministic. Regeneration overwrites manual Excalidraw edits; copy\ncontent changes back to the generator first.\n';
writeFileSync(`${output}README.md`, readme);
console.log(`Generated ${maps.length} Kubernetes homelab diagrams.`);
