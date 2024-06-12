var g = Object.defineProperty;
var l = (t, e, n) => e in t ? g(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var i = (t, e, n) => (l(t, typeof e != "symbol" ? e + "" : e, n), n);
const h = "0.0.19", d = {
  Main: "main",
  Lateral: "lateral"
}, p = h, m = "0.0.33", y = (t) => {
  _registerPlugin(t, {
    "@qatium/plugin": m,
    "@qatium/sdk": p
  });
};
var o = /* @__PURE__ */ ((t) => (t.getDMAs = "get-dmas", t.changeDMAcolor = "change-color", t))(o || {});
const a = [
  "#2FF5DE",
  "#3985F6",
  "#76EE58",
  "#E81543",
  "#F36E23",
  "#F454B4",
  "#F7D421"
], f = (t) => t >= a.length ? a[t % a.length] : a[t], L = (t, e, n) => ({
  type: "GeoJsonLayer",
  id: t,
  data: e.map(
    (r) => ({
      type: "Feature",
      geometry: r.geometry,
      properties: {}
    })
  ),
  opacity: 1,
  getLineColor: D(n),
  getLineWidth: 2,
  lineWidthUnits: "pixels",
  stroked: !0,
  lineJointRounded: !0,
  lineCapRounded: !0,
  visible: !0
}), D = (t) => {
  const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
  return e ? [
    parseInt(e[1], 16),
    parseInt(e[2], 16),
    parseInt(e[3], 16)
  ] : [0, 0, 0];
};
class P {
  constructor() {
    i(this, "isFirstRun", !0);
    i(this, "dmaLayers", []);
    i(this, "dmas", []);
  }
  run(e) {
    this.isFirstRun && (this.dmas = F(e), this.dmaLayers = R(e, this.dmas), this.isFirstRun = !1), e.ui.sendMessage({ event: o.getDMAs, dmas: this.dmas }), e.map.addOverlay(this.dmaLayers);
  }
  onMessage(e, n) {
    n.event === o.changeDMAcolor && (v(n.dma, this.dmas), this.dmaLayers = E(e, this.dmaLayers, n.dma), this.run(e));
  }
}
const F = (t) => t.network.getZones().map((e, n) => ({
  id: e.id,
  color: f(n),
  hasPipes: M(t, e.id)
})), M = (t, e) => {
  var r;
  const n = (r = t.network.getZone(e)) == null ? void 0 : r.getPipes((s) => s.group === d.Main);
  return n !== void 0 && n.length > 0;
}, R = (t, e) => {
  const n = [];
  return e.forEach((r) => {
    const s = u(t, r);
    s && n.push(s);
  }), n;
}, v = (t, e) => {
  const n = e.findIndex((r) => r.id === t.id);
  e[n] = t;
}, E = (t, e, n) => {
  const r = u(t, n);
  if (!r)
    return e;
  const s = e.findIndex(
    (c) => c.id === n.id
  );
  return e[s] = r, e;
}, u = (t, e) => {
  const n = I(t, e);
  if (n)
    return L(e.id, n, e.color);
}, I = (t, e) => {
  var r;
  const n = (r = t.network.getZone(e.id)) == null ? void 0 : r.getPipes((s) => s.group === d.Main);
  if (n !== void 0 && n.length !== 0)
    return n;
};
y(new P());
