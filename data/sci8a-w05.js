// 理化週課 第 5 週（2026-11-18 手動做，下週第二次段考）：4-3 光的折射與透鏡（含實驗 4-1 透鏡成像，最仔細）、4-4 光學儀器、4-5 光與顏色。南一版八上（課本目次確認）。
// 這一週不排補底，三節都是段考範圍；考前衝刺包下週另做。
// 名師影片：2026-11-18 用 yt-dlp 查過標題與章節秒數。PhET 三個模擬同日實際打開看過繁中介面。
const fs = require("fs");
const DRIVE = fs.existsSync("G:/我的雲端硬碟") ? "G:/我的雲端硬碟" : "/Users/teddylee/Library/CloudStorage/GoogleDrive-lennonlee7@gmail.com/我的雲端硬碟";
const ANI = `${DRIVE}/codex/學習中心/大女兒-理化/動畫`;
const EPS = [1, 2, 3, 4, 5].filter((n) => fs.existsSync(`${ANI}/w05-ep${n}.mp4`));
const vid = (n, cap) => (EPS.includes(n) ? [{ h: `🎬 動畫課第 ${n} 集`, body: [{ t: "video", v: `w05-ep${n}.mp4?v=1118`, poster: `w05-ep${n}.jpg`, cap }] }] : []);
const yt = (id, title, who, o = {}) => ({ t: "yt", id, title, who, ...o });
const tube = (say, ...v) => ({ h: "📺 換老師再講一次（選看）", body: [{ t: "guide", v: say }, ...v] });
const PHET = (code, screen) => `https://phet.colorado.edu/sims/html/${code}/latest/${code}_all.html?locale=zh_TW&screens=${screen}`;
const PHET_WHO = "PhET 互動模擬（科羅拉多大學，CC BY 4.0）";

const INK = "#3E3A39", BG = "#FFFCF6", CORAL = "#F2A497", YEL = "#F6D27A", MIZU = "#A8D3E6", GRN = "#B9DAA5", RED = "#C8553D", BLUE = "#2F7FA3", GREY = "#D8D4CC", LEAF = "#5B8C3A";
const T = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" font-size="${o.fs || 15}" ${o.b ? 'font-weight="700"' : ""} fill="${o.c || INK}" text-anchor="${o.a || "middle"}">${s}</text>`;
const frame = (w, h, inner, label, defs = "", bg = BG) =>
  `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${defs}<rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="${bg}"/>${inner}</svg>`;
const marker = (id, c) => `<marker id="${id}" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="13" viewBox="0 0 8 8" refX="5" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8z" fill="${c}"/></marker>`;
const defsOf = (...pairs) => `<defs>${pairs.map(([i, c]) => marker(i, c)).join("")}</defs>`;
const F1 = (n) => Number(n.toFixed(1));
const arrow = (x1, y1, x2, y2, id, c, w = 3) => `<line x1="${F1(x1)}" y1="${F1(y1)}" x2="${F1(x2)}" y2="${F1(y2)}" stroke="${c}" stroke-width="${w}" marker-end="url(#${id})"/>`;
const line = (x1, y1, x2, y2, c = INK, w = 3, dash = "") => `<line x1="${F1(x1)}" y1="${F1(y1)}" x2="${F1(x2)}" y2="${F1(y2)}" stroke="${c}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ""}/>`;
// 線的中段加一個箭頭（光線方向）
const ray = (x1, y1, x2, y2, id, c, w = 2.5, at = 0.55) => {
  const mx = x1 + (x2 - x1) * at, my = y1 + (y2 - y1) * at;
  return `<polyline points="${F1(x1)},${F1(y1)} ${F1(mx)},${F1(my)} ${F1(x2)},${F1(y2)}" fill="none" stroke="${c}" stroke-width="${w}" marker-mid="url(#${id})"/>`;
};
const rad = (d) => (d * Math.PI) / 180;
const WATER = "#D5EAF4";

// ───────── 4-3 折射 ─────────
// 1. 折射光路：空氣 → 水
const svgRefract = (() => {
  const X = 235, Y = 118, i = 50, r = (Math.asin(Math.sin(rad(i)) / 1.33) * 180) / Math.PI;
  const ax = X - 125 * Math.sin(rad(i)), ay = Y - 125 * Math.cos(rad(i));
  const bx = X + 118 * Math.sin(rad(r)), by = Y + 118 * Math.cos(rad(r));
  const cx = X + 110 * Math.sin(rad(i)), cy = Y - 110 * Math.cos(rad(i));
  let s = `<rect x="0" y="${Y}" width="470" height="${250 - Y}" fill="${WATER}"/><rect x="0" y="236" width="470" height="14" rx="0" fill="${WATER}"/>`;
  s += line(20, Y, 450, Y, INK, 3) + line(X, 18, X, 236, INK, 2, "6 5");
  s += ray(ax, ay, X, Y, "f1", RED, 3) + ray(X, Y, bx, by, "f2", BLUE, 3) + ray(X, Y, cx, cy, "f3", GREY, 2);
  // 角度弧
  const arc = (R, a0, a1, c) => {
    const p = (a) => `${F1(X + R * Math.sin(rad(a)))} ${F1(Y - R * Math.cos(rad(a)))}`;
    return `<path d="M${p(a0)} A${R} ${R} 0 0 ${a1 > a0 ? 1 : 0} ${p(a1)}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
  };
  s += arc(44, 0, -i, RED) + arc(52, 180, 180 - r, BLUE);
  s += T(200, 44, "入射角", { fs: 14, b: true, c: RED }) + T(262, 210, "折射角", { fs: 14, b: true, c: BLUE });
  s += T(112, 62, "入射線", { fs: 14, c: RED }) + T(336, 226, "折射線", { fs: 14, c: BLUE }) + T(372, 50, "反射線（也有一些）", { fs: 13, c: "#8A8580" });
  s += T(X, 14, "法線", { fs: 13, b: true }) + T(56, Y - 10, "空氣（光跑得快）", { fs: 14, b: true, a: "start" }) + T(56, Y + 24, "水（光跑得慢）", { fs: 14, b: true, a: "start" });
  s += T(110, 226, "界面", { fs: 13 }) + line(110, 212, 110, Y + 4, INK, 1.5);
  return frame(470, 250, s, "光從空氣斜射進水裡，折射線偏向法線，折射角小於入射角", defsOf(["f1", RED], ["f2", BLUE], ["f3", GREY]));
})();

// 2. 快 → 慢偏向法線；慢 → 快偏離法線；垂直不偏
const svgBend = (() => {
  const panel = (x0, title, mode) => {
    const X = x0 + 72, Y = 100;
    let s = `<rect x="${x0}" y="${Y}" width="144" height="76" fill="${WATER}"/><rect x="${x0}" y="30" width="144" height="146" fill="none" stroke="${INK}" stroke-width="2"/>`;
    s += line(x0, Y, x0 + 144, Y, INK, 2.5) + line(X, 36, X, 172, INK, 1.5, "5 4");
    const big = 52, small = (Math.asin(Math.sin(rad(big)) / 1.33) * 180) / Math.PI;
    if (mode === 0) s += ray(X - 70 * Math.sin(rad(big)), Y - 70 * Math.cos(rad(big)), X, Y, "b1", RED) + ray(X, Y, X + 78 * Math.sin(rad(small)), Y + 78 * Math.cos(rad(small)), "b2", BLUE);
    if (mode === 1) s += ray(X - 78 * Math.sin(rad(small)), Y + 78 * Math.cos(rad(small)), X, Y, "b1", RED) + ray(X, Y, X + 70 * Math.sin(rad(big)), Y - 70 * Math.cos(rad(big)), "b2", BLUE);
    if (mode === 2) s += ray(X, 38, X, Y, "b1", RED) + ray(X, Y, X, 170, "b2", BLUE);
    s += T(x0 + 8, 48, "空氣", { fs: 13, a: "start" }) + T(x0 + 8, 168, "水", { fs: 13, a: "start" });
    s += T(x0 + 72, 22, title[0], { fs: 14, b: true }) + T(x0 + 72, 196, title[1], { fs: 14, b: true, c: BLUE }) + T(x0 + 72, 216, title[2], { fs: 13 });
    return s;
  };
  const s = panel(10, ["空氣 → 水（快 → 慢）", "偏向法線", "折射角 ＜ 入射角"], 0) + panel(163, ["水 → 空氣（慢 → 快）", "偏離法線", "折射角 ＞ 入射角"], 1) + panel(316, ["垂直射入", "不偏折，直直走", "入射角、折射角都是 0°"], 2);
  return frame(470, 228, s, "空氣進水偏向法線，水進空氣偏離法線，垂直射入不偏折", defsOf(["b1", RED], ["b2", BLUE]));
})();

// 3. 視深：水裡的魚看起來比較淺
const svgDepth = (() => {
  const Y = 104, fx = 318, fy = 214, tw = 30, ta = (Math.asin(1.33 * Math.sin(rad(tw))) * 180) / Math.PI;
  const sx = fx - (fy - Y) * Math.tan(rad(tw));
  const ex = sx - 104 * Math.sin(rad(ta)), ey = Y - 104 * Math.cos(rad(ta));
  const t = (fx - sx) / Math.sin(rad(ta)), iy = Y + t * Math.cos(rad(ta));
  const fish = (x, y, ghost) => `<g ${ghost ? 'opacity="0.95"' : ""}><ellipse cx="${x}" cy="${F1(y)}" rx="22" ry="11" fill="${ghost ? "#fff" : CORAL}" stroke="${ghost ? BLUE : INK}" stroke-width="2.5" ${ghost ? 'stroke-dasharray="5 4"' : ""}/><path d="M${x + 20} ${F1(y)} l14 -9 v18z" fill="${ghost ? "#fff" : CORAL}" stroke="${ghost ? BLUE : INK}" stroke-width="2.5" ${ghost ? 'stroke-dasharray="5 4"' : ""} stroke-linejoin="round"/><circle cx="${x - 12}" cy="${F1(y - 3)}" r="2.2" fill="${ghost ? BLUE : INK}"/></g>`;
  let s = `<rect x="0" y="${Y}" width="470" height="${260 - Y}" fill="${WATER}"/>` + line(0, Y, 470, Y, INK, 3);
  s += ray(fx, fy, sx, Y, "v1", RED, 3) + ray(sx, Y, ex, ey, "v1", RED, 3) + line(sx, Y, fx, iy, BLUE, 2.5, "6 5");
  s += fish(fx, fy) + fish(fx, iy, true);
  s += `<circle cx="${F1(ex - 12)}" cy="${F1(ey - 10)}" r="13" fill="${YEL}" stroke="${INK}" stroke-width="2.5"/><circle cx="${F1(ex - 8)}" cy="${F1(ey - 10)}" r="3" fill="${INK}"/>`;
  s += T(ex - 12, ey - 30, "眼睛", { fs: 14, b: true });
  s += T(364, iy + 5, "看到的魚（像）", { fs: 14, b: true, c: BLUE, a: "start" }) + T(364, fy + 5, "真正的魚", { fs: 14, b: true, a: "start" });
  s += T(100, Y + 60, "大腦以為光是", { fs: 14, c: BLUE }) + T(100, Y + 80, "直直過來的", { fs: 14, c: BLUE });
  s += T(235, 250, "看到的位置比實際的淺：視深 ＜ 實深", { fs: 16, b: true, c: RED });
  return frame(470, 262, s, "從岸上看水裡的魚，看到的像比魚真正的位置淺", defsOf(["v1", RED]));
})();

// ───────── 4-3 透鏡 ─────────
const convex = (x, y, hh = 70, c = MIZU) => `<path d="M${x} ${y - hh} Q${x + 22} ${y} ${x} ${y + hh} Q${x - 22} ${y} ${x} ${y - hh}z" fill="${c}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
const concave = (x, y, hh = 70, c = MIZU) => `<path d="M${x - 12} ${y - hh} H${x + 12} Q${x + 2} ${y} ${x + 12} ${y + hh} H${x - 12} Q${x - 2} ${y} ${x - 12} ${y - hh}z" fill="${c}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
const dot = (x, y, lab, c = INK, dy = 20) => `<circle cx="${F1(x)}" cy="${y}" r="4" fill="${c}"/>` + T(x, y + dy, lab, { fs: 13, b: true, c });
const upArrow = (x, y0, h, c, id, ghost) => `<line x1="${F1(x)}" y1="${y0}" x2="${F1(x)}" y2="${F1(y0 - h)}" stroke="${c}" stroke-width="4" ${ghost ? 'stroke-dasharray="6 4"' : ""} marker-end="url(#${id})"/>`;

// 4. 凸透鏡會聚、凹透鏡發散
const svgTwoLens = (() => {
  let s = "";
  // 凸
  const xa = 110, y = 100, f = 80;
  s += line(14, y, 222, y, GREY, 2) + convex(xa, y, 62);
  [-40, 0, 40].forEach((d) => (s += ray(18, y + d, xa, y + d, "t1", RED) + (d ? line(xa, y + d, xa + f + 26, y - (d * 26) / f, RED, 2.5) : line(xa, y, xa + f + 26, y, RED, 2.5))));
  s += dot(xa + f, y, "焦點 F", RED, 24);
  s += `<line x1="${xa}" y1="178" x2="${xa + f}" y2="178" stroke="${INK}" stroke-width="2" marker-start="url(#t2)" marker-end="url(#t2)"/>` + T(xa + f / 2, 172, "焦距 f", { fs: 13, b: true });
  s += T(118, 206, "凸透鏡：中間厚、邊緣薄", { fs: 14, b: true }) + T(118, 226, "把光會聚到焦點", { fs: 14, c: RED });
  // 凹
  const xb = 350;
  s += line(248, y, 456, y, GREY, 2) + concave(xb, y, 62);
  [-40, 0, 40].forEach((d) => {
    s += ray(252, y + d, xb, y + d, "t1", RED);
    if (d) s += line(xb, y + d, xb + 100, y + d + (d * 100) / f, RED, 2.5) + line(xb, y + d, xb - f, y, BLUE, 1.8, "5 4");
    else s += line(xb, y, xb + 100, y, RED, 2.5);
  });
  s += dot(xb - f, y, "焦點 F", BLUE, 24);
  s += T(352, 206, "凹透鏡：中間薄、邊緣厚", { fs: 14, b: true }) + T(352, 226, "把光發散，好像從焦點射出來", { fs: 14, c: BLUE });
  return frame(470, 238, s, "凸透鏡把平行光會聚到焦點，凹透鏡把平行光發散", defsOf(["t1", RED], ["t2", INK]));
})();

// 透鏡成像作圖通用：x0 鏡心、y0 主軸、f 焦距(px，凹透鏡給負)、p 物距、h 物高
const lensFig = ({ W = 470, H = 240, x0 = 235, y0 = 110, f, p, h, three = false, note = [], white = false, label, hideImgLabel = false, lh = 78 }) => {
  const q = (p * f) / (p - f), hi = (-h * q) / p, xo = x0 - p, xi = x0 + q, yt = y0 - h, yi = y0 - hi, af = Math.abs(f);
  let s = line(12, y0, W - 12, y0, GREY, 2);
  s += f > 0 ? convex(x0, y0, lh) : concave(x0, y0, lh);
  [[-2, "2F"], [-1, "F"], [1, "F"], [2, "2F"]].forEach(([k, lab]) => { const x = x0 + k * af; if (x > 20 && x < W - 20) s += `<circle cx="${F1(x)}" cy="${y0}" r="4" fill="${INK}"/>` + (k > 0 ? T(x + 13, y0 - 9, lab, { fs: 13, b: true }) : T(x, y0 + 20, lab, { fs: 13, b: true })); });
  s += T(x0, y0 + 20, "O", { fs: 13, b: true });
  s += upArrow(xo, y0, h, INK, "l0");
  if (f > 0 && q > 0) {
    s += ray(xo, yt, x0, yt, "l1", RED) + ray(x0, yt, xi, yi, "l1", RED) + ray(xo, yt, xi, yi, "l2", BLUE, 2.5, 0.3);
    if (three) s += ray(xo, yt, x0, yi, "l3", LEAF, 2.5, 0.35) + ray(x0, yi, xi, yi, "l3", LEAF);
    s += upArrow(xi, y0, hi, RED, "l1");
    if (!hideImgLabel) s += T(xi + 8, yi + 18, "像", { fs: 15, b: true, c: RED, a: "start" });
  } else {
    // 虛像：折射後的光線向右散開，反向延長（虛線）交在同一側
    let dx = Math.min(W - 16, x0 + 150) - x0; if (f < 0) dx = Math.min(dx, ((yt - 14) * af) / h); const ex = x0 + dx;
    s += ray(xo, yt, x0, yt, "l1", RED) + ray(x0, yt, ex, yt + (h / f) * dx, "l1", RED) + line(x0, yt, xi, yi, RED, 1.8, "5 4");
    const bx = Math.min(W - 16, x0 + 110);
    s += ray(xo, yt, bx, y0 + (h / p) * (bx - x0), "l2", BLUE, 2.5, 0.75) + line(xo, yt, xi, yi, BLUE, 1.8, "5 4");
    s += upArrow(xi, y0, hi, RED, "l1", true);
    if (!hideImgLabel) s += f > 0 ? T(xi - 8, yi + 4, "像（虛像）", { fs: 14, b: true, c: RED, a: "end" }) : T(xi + 6, y0 + 40, "像（虛像）", { fs: 14, b: true, c: RED });
  }
  s += T(xo, y0 + 38, "物體", { fs: 13, b: true });
  note.forEach(([x, y, t, o]) => (s += T(x, y, t, o)));
  return frame(W, H, s, label, defsOf(["l0", INK], ["l1", RED], ["l2", BLUE], ["l3", LEAF]), white ? "#FFFFFF" : BG);
};

// 5. 三條特殊光線
const svgThreeRays = lensFig({ f: 62, p: 150, h: 52, three: true, H: 262, y0: 104, label: "凸透鏡的三條特殊光線：平行主軸的過焦點、過鏡心的不偏折、過焦點的變平行",
  note: [[150, 28, "① 平行主軸 → 折射後通過焦點", { fs: 14, b: true, c: RED, a: "start" }], [16, 224, "② 通過鏡心 O → 直直走，不偏折", { fs: 14, b: true, c: BLUE, a: "start" }], [16, 246, "③ 先通過焦點 → 折射後和主軸平行", { fs: 14, b: true, c: LEAF, a: "start" }]] });
// 6. 物體在兩倍焦距外：倒立縮小實像
const svgCaseFar = lensFig({ f: 60, p: 165, h: 56, H: 232, y0: 104, label: "物體在兩倍焦距外，成倒立縮小的實像，像在另一側的一倍到兩倍焦距之間",
  note: [[235, 220, "物體在 2F 外 → 倒立、縮小、實像（照相機、眼睛）", { fs: 15, b: true, c: RED }]] });
// 7. 物體在 F～2F：倒立放大實像
const svgCaseMid = lensFig({ f: 60, p: 92, h: 30, H: 232, y0: 92, label: "物體在一倍到兩倍焦距之間，成倒立放大的實像，像在另一側兩倍焦距外",
  note: [[235, 220, "物體在 F～2F 之間 → 倒立、放大、實像（投影機）", { fs: 15, b: true, c: RED }]] });
// 8. 物體在焦點內：正立放大虛像
const svgCaseNear = lensFig({ f: 96, p: 54, h: 34, H: 232, y0: 134, x0: 250, label: "物體在焦點內，成正立放大的虛像，像和物體在同一側",
  note: [[235, 220, "物體在 F 內 → 正立、放大、虛像（放大鏡）", { fs: 15, b: true, c: RED }], [404, 84, "從這邊", { fs: 13 }], [404, 102, "往透鏡看", { fs: 13 }]] });
// 9. 凹透鏡：正立縮小虛像
const svgConcave = lensFig({ f: -84, p: 104, h: 70, H: 252, y0: 130, lh: 60, label: "凹透鏡只能成正立縮小的虛像，像在物體和透鏡之間",
  note: [[235, 240, "凹透鏡：不管物體放哪 → 正立、縮小、虛像", { fs: 15, b: true, c: RED }]] });

// 10. 成像總圖：物體在哪一區 → 像在哪一區
const svgZones = (() => {
  const x0 = 235, y = 96, f = 66;
  let s = "";
  const zone = (xa, xb, c, lab, sub, yy = y) => `<rect x="${xa}" y="${yy - 26}" width="${xb - xa}" height="52" fill="${c}" opacity="0.85"/>` + T((xa + xb) / 2, yy - 4, lab, { fs: 15, b: true }) + T((xa + xb) / 2, yy + 16, sub, { fs: 12.5 });
  s += zone(20, x0 - 2 * f, GRN, "①", "2F 外") + zone(x0 - 2 * f, x0 - f, YEL, "②", "F～2F") + zone(x0 - f, x0 - 14, CORAL, "③", "F 內");
  s += zone(x0 + f, x0 + 2 * f, GRN, "①′", "縮小") + zone(x0 + 2 * f, 450, YEL, "②′", "放大");
  s += line(12, y, 458, y, INK, 2) + convex(x0, y, 54);
  [[-2, "2F"], [-1, "F"], [1, "F"], [2, "2F"]].forEach(([k, lab]) => (s += `<circle cx="${x0 + k * f}" cy="${y}" r="4.5" fill="${INK}"/>` + T(x0 + k * f, y + 46, lab, { fs: 14, b: true })));
  s += T(104, 24, "物體放這邊", { fs: 14, b: true }) + T(366, 24, "實像出現在這邊（用紙屏接）", { fs: 14, b: true });
  s += T(235, 176, "① 2F 外 → 像在 ①′：倒立、縮小、實像", { fs: 14.5, b: true, c: LEAF });
  s += T(235, 198, "② F～2F → 像在 ②′：倒立、放大、實像", { fs: 14.5, b: true, c: "#A8791A" });
  s += T(235, 220, "③ F 內 → 紙屏接不到；同一側出現正立、放大的虛像", { fs: 14.5, b: true, c: RED });
  s += T(235, 246, "剛好在 2F：倒立、一樣大的實像（像也在 2F）　剛好在 F：不成像", { fs: 13 });
  return frame(470, 258, s, "凸透鏡成像總圖：物體在兩倍焦距外成縮小實像，在一倍到兩倍焦距之間成放大實像，在焦點內成放大虛像");
})();

// 11. 實驗 4-1 裝置
const svgBench = (() => {
  const y = 150;
  let s = `<rect x="24" y="${y}" width="422" height="14" rx="3" fill="${YEL}" stroke="${INK}" stroke-width="2.5"/>`;
  for (let i = 0; i <= 10; i++) s += line(40 + i * 39, y, 40 + i * 39, y + 7, INK, 1.5);
  const stand = (x) => line(x, y, x, y - 26, INK, 3) + `<rect x="${x - 12}" y="${y - 4}" width="24" height="8" fill="${GREY}" stroke="${INK}" stroke-width="2"/>`;
  s += stand(96) + stand(235) + stand(374);
  s += `<rect x="89" y="${y - 78}" width="14" height="52" rx="2" fill="${YEL}" stroke="${INK}" stroke-width="2.5"/><ellipse cx="96" cy="${y - 90}" rx="7" ry="12" fill="${CORAL}" stroke="${INK}" stroke-width="2"/>`;
  s += convex(235, y - 84, 44);
  s += `<rect x="368" y="${y - 122}" width="12" height="96" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`;
  s += line(30, y - 84, 440, y - 84, RED, 1.5, "6 5");
  s += T(96, 38, "蠟燭", { b: true }) + T(235, 14 + 6, "凸透鏡", { b: true }) + T(374, 20, "紙屏", { b: true });
  s += T(410, y - 90, "同一個", { fs: 13, c: RED }) + T(410, y - 72, "高度", { fs: 13, c: RED });
  s += `<line x1="100" y1="186" x2="231" y2="186" stroke="${RED}" stroke-width="2.5" marker-start="url(#e1)" marker-end="url(#e1)"/><line x1="239" y1="186" x2="370" y2="186" stroke="${BLUE}" stroke-width="2.5" marker-start="url(#e2)" marker-end="url(#e2)"/>`;
  s += T(166, 206, "物距", { fs: 14, b: true, c: RED }) + T(304, 206, "像距", { fs: 14, b: true, c: BLUE });
  s += T(235, 232, "燭焰、透鏡中心、紙屏中心要排在同一個高度", { fs: 14.5, b: true });
  return frame(470, 244, s, "透鏡成像實驗裝置：蠟燭、凸透鏡、紙屏依序放在光具座上，三者中心同高", defsOf(["e1", RED], ["e2", BLUE]));
})();

// ───────── 4-4 光學儀器 ─────────
// 12. 近視和遠視
const svgEyes = (() => {
  const eye = (cx, cy, fx, title, fix, lens) => {
    const R = 46;
    let s = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="${INK}" stroke-width="3"/>` + `<ellipse cx="${cx - R + 9}" cy="${cy}" rx="8" ry="20" fill="${MIZU}" stroke="${INK}" stroke-width="2"/>`;
    s += `<path d="M${cx + R - 2} ${cy - 22} A${R} ${R} 0 0 1 ${cx + R - 2} ${cy + 22}" fill="none" stroke="${RED}" stroke-width="5"/>`;
    [-16, 16].forEach((d) => {
      s += ray(cx - 120, cy + d, cx - R + 9, cy + d, "y1", RED, 2.2, 0.45);
      const xe = cx + R - 3, t = (xe - (cx - R + 9)) / (fx - (cx - R + 9));
      s += line(cx - R + 9, cy + d, xe, cy + d - d * t, RED, 2.2);
    });
    s += `<circle cx="${fx}" cy="${cy}" r="4.5" fill="${BLUE}"/>`;
    s += T(cx - 20, cy - 62, title, { fs: 15, b: true });
    s += lens === "cc" ? concave(cx - 96, cy + 96, 22, YEL) : convex(cx - 96, cy + 96, 22, YEL);
    s += T(cx - 72, cy + 92, fix[0], { fs: 14, b: true, c: BLUE, a: "start" }) + T(cx - 72, cy + 112, fix[1], { fs: 13, a: "start" });
    return s;
  };
  let s = eye(150, 100, 172, "近視：像落在視網膜前面", ["戴凹透鏡", "先把光發散一點"], "cc") + eye(385, 100, 452, "遠視：像落在視網膜後面", ["戴凸透鏡", "先把光會聚一點"], "cv");
  s += T(196, 152, "視網膜", { fs: 12.5, c: RED, a: "start" }) + line(234, 14, 234, 226, GREY, 2, "4 4");
  return frame(470, 238, s, "近視成像在視網膜前，戴凹透鏡矯正；遠視成像在視網膜後，戴凸透鏡矯正", defsOf(["y1", RED]));
})();

// ───────── 4-5 光與顏色 ─────────
const RAINBOW = [["紅", "#E5484D"], ["橙", "#F2913D"], ["黃", "#F2C94C"], ["綠", "#4CAF6D"], ["藍", "#3B82C4"], ["靛", "#4B4FB0"], ["紫", "#8E55B8"]];
// 13. 三稜鏡色散
const svgPrism = (() => {
  let s = `<path d="M200 36 L276 176 H124z" fill="#EEF6FA" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  s += `<polyline points="20,140 90,123 164,105" fill="none" stroke="${INK}" stroke-width="5"/><polyline points="20,140 90,123 164,105" fill="none" stroke="#fff" stroke-width="2.4" marker-mid="url(#p1)"/>`;
  RAINBOW.forEach(([n, c], i) => {
    const yb = 112 + i * 2.6, ye = 96 + i * 20;
    s += line(164, 105, 239, yb, c, 2) + line(239, yb, 410, ye, c, 4);
    s += T(428, ye + 5, n, { fs: 14, b: true, c });
  });
  s += T(62, 108, "白光（太陽光）", { fs: 14, b: true }) + T(200, 196, "三稜鏡", { fs: 14, b: true });
  s += T(330, 74, "紅光偏折最小", { fs: 14, b: true, c: "#E5484D" }) + T(318, 246, "紫光偏折最大", { fs: 14, b: true, c: "#8E55B8" });
  s += T(110, 232, "白光被分成七種色光", { fs: 14 }) + T(110, 252, "這個現象叫做「色散」", { fs: 14, b: true, c: RED });
  return frame(470, 262, s, "白光通過三稜鏡色散成紅橙黃綠藍靛紫，紅光偏折最小、紫光偏折最大", defsOf(["p1", INK]));
})();
// 14. 光的三原色
const svgRGB = (() => {
  const cx = 150, cy = 118, r = 62, d = 38;
  let s = `<rect x="16" y="14" width="268" height="212" rx="12" fill="#111"/>`;
  s += `<g style="isolation:isolate"><circle cx="${cx}" cy="${cy - d}" r="${r}" fill="#FF0000" style="mix-blend-mode:screen"/><circle cx="${cx - d * 0.87}" cy="${cy + d * 0.5}" r="${r}" fill="#00FF00" style="mix-blend-mode:screen"/><circle cx="${cx + d * 0.87}" cy="${cy + d * 0.5}" r="${r}" fill="#0000FF" style="mix-blend-mode:screen"/></g>`;
  s += T(cx, cy - d - 26, "紅", { fs: 16, b: true, c: "#fff" }) + T(cx - d * 0.87 - 30, cy + d * 0.5 + 30, "綠", { fs: 16, b: true, c: "#111" }) + T(cx + d * 0.87 + 30, cy + d * 0.5 + 30, "藍", { fs: 16, b: true, c: "#fff" });
  s += T(cx - 34, cy - 12, "黃", { fs: 14, b: true, c: "#111" }) + T(cx + 34, cy - 12, "洋紅", { fs: 13, b: true, c: "#111" }) + T(cx, cy + 48, "青", { fs: 14, b: true, c: "#111" }) + T(cx, cy + 10, "白", { fs: 15, b: true, c: "#111" });
  s += T(378, 44, "光的三原色", { fs: 16, b: true }) + T(378, 66, "紅、綠、藍", { fs: 15, b: true, c: RED });
  [["紅 ＋ 綠 ＝ 黃", 104], ["紅 ＋ 藍 ＝ 洋紅（紫紅）", 128], ["綠 ＋ 藍 ＝ 青", 152], ["紅 ＋ 綠 ＋ 藍 ＝ 白", 180]].forEach(([t, y]) => (s += T(378, y, t, { fs: 14, b: y === 180 })));
  s += T(378, 212, "手機、電視螢幕就是這樣配色", { fs: 12.5 });
  return frame(470, 240, s, "光的三原色紅綠藍：紅加綠是黃，紅加藍是洋紅，綠加藍是青，三色相加是白");
})();
// 15. 物體的顏色
const svgObjColor = (() => {
  const R = "#E5484D", G = "#4CAF6D", B = "#3B82C4";
  const beam = (x1, y1, x2, y2, c, id) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="4" marker-end="url(#${id})"/>`;
  let s = "";
  // 左：白光照紅蘋果
  s += `<circle cx="118" cy="150" r="34" fill="${R}" stroke="${INK}" stroke-width="3"/><path d="M118 116 q4 -14 14 -16" fill="none" stroke="${INK}" stroke-width="3"/>`;
  s += beam(30, 40, 84, 108, R, "o1") + beam(42, 34, 96, 102, G, "o2") + beam(54, 28, 108, 96, B, "o3");
  s += beam(140, 114, 196, 44, R, "o1");
  s += T(46, 22, "白光（紅＋綠＋藍）", { fs: 13, b: true, a: "start" }) + T(206, 66, "只反射", { fs: 13, c: R, a: "start" }) + T(206, 84, "紅光", { fs: 13, b: true, c: R, a: "start" });
  s += T(118, 210, "紅蘋果：反射紅光，", { fs: 14, b: true }) + T(118, 230, "綠光、藍光被吸收", { fs: 14 });
  s += line(238, 16, 238, 236, GREY, 2, "4 4");
  // 右：紅光照綠葉
  s += `<path d="M320 178 Q318 118 372 116 Q378 172 320 178z" fill="#2A2A2A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M324 174 L360 130" stroke="#555" stroke-width="2"/>`;
  s += beam(262, 40, 326, 122, R, "o1");
  s += T(258, 22, "只有紅光", { fs: 13, b: true, c: R, a: "start" }) + T(404, 100, "沒有綠光", { fs: 13, a: "middle" }) + T(404, 118, "可以反射", { fs: 13 });
  s += T(354, 210, "綠葉在紅光下：", { fs: 14, b: true }) + T(354, 230, "紅光被吸收 → 看起來是黑的", { fs: 14 });
  return frame(470, 244, s, "紅蘋果在白光下反射紅光所以是紅色；綠葉在紅光下沒有光可以反射所以看起來是黑色", defsOf(["o1", R], ["o2", G], ["o3", B]));
})();

// ───────── 段考題組用的圖（白底、不寫提示）─────────
const svgRefrQ = (() => {
  const X = 235, Y = 112, i = 50;
  let s = `<rect x="0" y="${Y}" width="470" height="${236 - Y}" fill="#E4F0F6"/>` + line(20, Y, 450, Y, INK, 3) + line(X, 16, X, 222, INK, 2, "6 5");
  s += ray(X - 120 * Math.sin(rad(i)), Y - 120 * Math.cos(rad(i)), X, Y, "q1", INK, 3);
  [["甲", 70], ["乙", 50], ["丙", 33], ["丁", 0]].forEach(([n, a]) => {
    const L = 112, ex = X + L * Math.sin(rad(a)), ey = Y + L * Math.cos(rad(a));
    if (a) s += arrow(X, Y, ex, ey, "q1", INK, 2.5);
    else s += arrow(X + 0, Y, X, Y + L - 4, "q1", INK, 2.5);
    s += T(X + (L + 20) * Math.sin(rad(a)) + (a ? 6 : 16), Y + (L + 20) * Math.cos(rad(a)) + (a ? 4 : -14), n, { fs: 17, b: true });
  });
  s += `<path d="M${X - 40} ${Y} A40 40 0 0 1 ${F1(X - 40 * Math.sin(rad(i)))} ${F1(Y - 40 * Math.cos(rad(i)))}" fill="none" stroke="${INK}" stroke-width="2.5"/>` + T(170, 100, "40°", { fs: 16, b: true });
  s += T(60, 96, "空氣", { fs: 15, b: true }) + T(60, 138, "水", { fs: 15, b: true }) + T(X, 12, "法線", { fs: 13 }) + T(100, 40, "入射線", { fs: 14 });
  return frame(470, 236, s, "一道光從空氣斜射入水中，入射線和水面夾四十度，水中有甲乙丙丁四條可能的路徑；乙是原方向的延長線，甲比乙更遠離法線，丙在乙和法線之間，丁和法線重合", defsOf(["q1", INK]), "#FFFFFF");
})();
const svgBenchQ = (() => {
  const y = 128, X = (cm) => 35 + cm * 4;
  let s = `<rect x="27" y="${y}" width="416" height="16" fill="#F3E3B0" stroke="${INK}" stroke-width="2.5"/>`;
  for (let c = 0; c <= 100; c += 5) s += line(X(c), y, X(c), y + (c % 10 ? 6 : 10), INK, 1.5) + (c % 10 ? "" : T(X(c), y + 34, String(c), { fs: 13 }));
  s += T(235, y + 56, "光具座上的刻度（cm）", { fs: 14 });
  s += line(X(50), y, X(50), y - 20, INK, 3) + convex(X(50), y - 62, 40, "#DDECF3") + T(X(50), 16, "凸透鏡（焦距 10 cm）", { fs: 14, b: true });
  s += `<rect x="${X(20) - 6}" y="${y - 58}" width="12" height="58" rx="2" fill="#F3E3B0" stroke="${INK}" stroke-width="2.5"/><ellipse cx="${X(20)}" cy="${y - 68}" rx="6" ry="10" fill="#fff" stroke="${INK}" stroke-width="2"/>` + T(X(20), 40, "蠟燭", { fs: 14, b: true });
  s += `<rect x="${X(85) - 5}" y="${y - 104}" width="10" height="104" fill="#fff" stroke="${INK}" stroke-width="2.5"/>` + T(X(85), 16, "紙屏（可移動）", { fs: 14, b: true });
  return frame(470, 196, s, "光具座：凸透鏡固定在五十公分處，焦距十公分；蠟燭在二十公分處；紙屏在透鏡右側可以移動", "", "#FFFFFF");
})();

module.exports = {
  id: "sci8a-w05",
  title: "理化週課 #5：會轉彎的光 × 透鏡魔法 × 顏色的秘密",
  icon: "🔍",
  kid: "大女兒", grade: "國二", subject: "理化", version: "南一", range: "4-3 光的折射與透鏡（含實驗 4-1 透鏡成像）｜4-4 光學儀器｜4-5 光與顏色", exam: "第 5 週・二段考前",
  guide: { ava: "👩‍🔬", name: "小P學姊" },
  ranks: [[0, "🧪", "實驗室新手"], [0.5, "🔬", "見習研究員"], [0.7, "⚗️", "小小科學家"], [0.9, "🏅", "理化達人"], [1, "🚀", "諾貝爾候選人"]],
  goal: 4,
  story: {
    title: "彩虹失竊記", ava: "🌈",
    intro: [
      "一早醒來，整個小鎮變成黑白的。花是灰的、制服是灰的，連便當裡的蛋都是灰的。天上的彩虹不見了。",
      "阿波在水池邊找到三串腳印。小P學姊遞給你一個放大鏡：「三個小偷把顏色藏在光裡面。每答對一題，就搶回一點顏色。」" ],
    acts: {
      看懂: { name: "歪歪水怪", ava: "🐸", intro: "牠躲在水池裡，把筷子弄斷、把魚的位置騙給你看。牠只會最基本的幾招，先拿牠暖身。", win: "歪歪水怪噗通一聲沉到池底，池水恢復清澈，藍色回來了。" },
      課本: { name: "顛倒鏡片師", ava: "🧙", intro: "牠手上一片凸透鏡、一片凹透鏡，把整條街弄得上下顛倒。牠出的全是課本上的招式，先想物體在哪一區再出手。", win: "顛倒鏡片師的鏡片碎了一地，街道轉正，紅色和綠色回來了。" },
      段考挑戰: { name: "偷色大王", ava: "🎩", intro: "最後一關。彩虹就藏在牠的帽子裡。牠的招式和段考一樣要想兩步，被牠躲開很正常，之後還能補刀。", win: "偷色大王的帽子飛上天，七種顏色一口氣噴出來。" } },
    end: "三個小偷都被你打倒了。彩虹掛回天上，由外到內是紅橙黃綠藍靛紫，一色都沒少。阿波的便當也終於有顏色了。",
    cont: "彩虹還缺幾種顏色：有小偷帶著最後幾滴血躲進「📕 錯題」。去那裡把錯的題目重做到對，把顏色搶回來。" },
  home: {
    intro: "嗨！下週就要段考了，這一份把光的後半段一次補齊：<b>4-3 折射與透鏡</b>、<b>4-4 光學儀器</b>、<b>4-5 光與顏色</b>。其中 <b>4-3 的透鏡成像</b>最常考、也最容易亂，所以這份教材把它講得最細，還附了一張「成像總圖」。只要把那張圖看懂，後面的相機、眼睛、放大鏡都是同一件事。",
    cards: [
      { h: "📅 考前分 4 次，每次約 30 分鐘", body: [{ t: "tiles", v: [
        { em: "1️⃣", h: "第 1 次：光會轉彎", p: "暖身三謎題 → 讀「① 折射」站 → 玩折射模擬。" },
        { em: "2️⃣", h: "第 2 次：透鏡成像（最重要）", p: "讀「② 透鏡成像」站 → 玩透鏡模擬 → 排「透鏡實驗步驟」順序。這一站內容最多，慢慢看。" },
        { em: "3️⃣", h: "第 3 次：儀器和顏色", p: "讀「③ 光學儀器」「④ 顏色」兩站 → 玩色光模擬 → 翻記憶卡。" },
        { em: "4️⃣", h: "第 4 次：闖關", p: "做兩個小實驗 → 闖關 30 題（打三個小偷）→ 錯題本補刀 → 手寫 2 題 → 出場券 → 📤 傳給爸爸。" } ] },
        { t: "guide", v: "哪四天做由你自己挑，不用連著做。一次做不完，下次接著做就好，進度都會留著。下週還會有一份考前衝刺包，把第 3、4 章整個再跑一次。" } ] },
      { h: "📝 怎麼作答", body: [
        { t: "tiles", v: [
          { em: "👆", h: "點選題", p: "看到一排 (A)(B)(C) 按鈕，<b>點一個</b>你覺得對的就好。" },
          { em: "⌨️", h: "填空題", p: "在白色框框<b>打數字</b>，再按「對答案」。錯了會給提示，可以再試一次。" },
          { em: "✍️", h: "手寫題", p: "用<b>手指或觸控筆</b>寫在白板上；寫在紙上的話按「📷 拍照交」。" },
          { em: "📤", h: "傳給爸爸", p: "第 4 次最後按「📤 傳給爸爸」，這份就完成了！" } ] },
        { t: "guide", v: "你寫的答案會自動存在這台平板上，關掉再打開也還在。首頁最上面的「🔁 今日複習」每天最多 5 題，會把以前錯過的題目再拿出來問你。" } ] },
      ...(EPS.length ? [{ h: `🎬 本週動畫課（${EPS.length} 集）`, body: [
        { t: "guide", v: "動畫放在每一站的最上面。小P學姊和阿波會把重點講完，看完再往下讀，會輕鬆很多！" } ] }] : []),
      { h: "🗺️ 這三節在考什麼（先看一眼地圖）", body: [
        { t: "table", head: ["節", "一句話", "段考最愛考"], rows: [
          ["4-3 折射", "光從一種介質斜斜進到另一種介質，會轉彎", "偏向法線還是偏離法線、看到的魚比較淺"],
          ["4-3 透鏡", "凸透鏡會聚光、凹透鏡發散光", "<b>物體放在哪一區，成什麼像</b>（必考）"],
          ["4-4 光學儀器", "相機、眼睛、放大鏡、顯微鏡都是透鏡的應用", "近視戴什麼鏡片、各儀器成什麼像"],
          ["4-5 光與顏色", "白光是很多色光混在一起", "紅光照綠葉看起來什麼顏色"] ] } ] },
      { h: "🗓️ 我的理化 12 週地圖", body: [
        "下週段考，所以這一週把第 4 章剩下的三節一次做完，原本排的補底先暫停，下週改成考前衝刺。",
        { t: "table", head: ["週", "週一", "📘 補底", "☀️ 新課"], rows: [
          ["1", "10/26", "1-1、1-2 測量", "3-1 波、3-2 聲音"],
          ["2", "11/2", "1-3 密度", "3-3 聲波的反射"],
          ["4", "11/16", "3-4 多變的聲音", "4-1 光的傳播、4-2 反射與面鏡"],
          ["⭐5", "11/18 起", "—", "4-3 折射與透鏡、4-4 光學儀器、4-5 光與顏色"],
          ["6", "11/23 那週", "—", "第二次段考衝刺包（第 3、4 章）"],
          ["7", "12/7", "2-1 認識物質", "5-1 溫度與溫度計"],
          ["8", "12/14", "2-2 水溶液", "5-2 熱量與比熱"],
          ["9", "12/21", "2-3 空氣", "5-3 熱對物質、5-4 熱的傳播"],
          ["10", "12/28", "前週回顧", "6-1 純物質、6-2 元素"],
          ["11", "1/4", "前週回顧", "6-3 週期表、6-4 原子結構"],
          ["12", "1/11", "期末衝刺", "6-5 分子與化學式＋總複習"] ] }] },
      { h: "👨 給爸爸的陪讀小抄（不用會理化也能陪）", body: [{ t: "list", v: [
        "最重要的是「② 透鏡成像」站的<b>成像總圖</b>。請她指著圖講：物體放在 ①、②、③ 哪一區，各成什麼像。講得出來，這一節就拿到大半分數。",
        "第 4 次的兩個小實驗可以一起玩：碗裡的硬幣加水會「浮上來」；裝水的圓杯子會把後面的箭頭變成反方向。",
        "家裡有放大鏡的話，拿到窗邊，把窗外的景物投在白紙上，會看到<b>倒過來、縮小</b>的像。這就是照相機和眼睛的原理。",
        "最後 3 分鐘：請她看著「出場券」，<b>用自己的話</b>講給你聽。" ] }] },
    ],
  },
  stations: [
    { id: "warm", nav: "🤔 暖身", intro: "下面三題<b>點一個你猜的答案</b>就好，答案會在後面的站揭曉。猜錯完全沒關係。",
      cards: [
        { h: "🤔 三個生活謎題（先猜再學）", body: [
          { t: "ask", id: "g1", reveal: "「① 折射」那一站", how: "憑感覺點一個就好，猜錯沒關係！", q: "🥢 謎題 1：筷子斜斜插進一杯水裡，從旁邊看，筷子好像在水面的地方斷掉了。為什麼？", o: ["水把筷子泡彎了", "光從水進到空氣的時候轉彎了", "水面像鏡子一樣把筷子反射了"], a: 1 },
          { t: "ask", id: "g2", reveal: "「② 透鏡成像」那一站", how: "憑感覺點一個就好！", q: "🔍 謎題 2：放大鏡拿在手上、手伸直，透過它看遠遠的窗外，看到的景物會是什麼樣子？", o: ["放大、正的", "縮小、倒過來的", "和沒拿放大鏡一樣"], a: 1 },
          { t: "ask", id: "g3", reveal: "「④ 顏色」那一站", how: "憑感覺點一個就好！", q: "🍃 謎題 3：在一間全黑的房間裡，只開一盞<b>紅色</b>的燈，照在一片綠色的葉子上。葉子看起來是什麼顏色？", o: ["綠色", "黃色", "幾乎是黑色"], a: 2 },
          { t: "guide", v: "三題都點完就可以往下一站「① 折射」囉！猜錯的地方，正好就是這次要學的。" } ] },
      ] },

    // ───────── ① 折射 ─────────
    { id: "s1", nav: "① 折射", intro: "上一週學到光碰到鏡子會<b>彈回來</b>（反射）。這一站要看另一件事：光從空氣鑽進水裡的時候，會<b>轉彎</b>。泳池看起來比較淺、筷子看起來斷掉，都是它搞的鬼。",
      cards: [
        ...vid(1, "光為什麼會轉彎：折射、偏向法線、看到的魚比較淺。"),
        tube("韓斯老師這一段前半在講折射定律（後半是透鏡，下一站會用到）。看不懂或想多聽一次再點，挑一支就好。",
          yt("LR-xGLb1eR8", "折射定律、凹透鏡、凸透鏡、光路圖", "韓斯頭殼", { s: 1375, e: 1815, len: "約 7 分", tag: "重點" }),
          yt("4m3Cmv01MTs", "國二上 4-3 光的折射（完整一堂課・第 1 段）", "國中理化自學", { len: "24 分", tag: "完整版" })),
        { h: "🚗 光為什麼會轉彎？", body: [
          "想像你推著一台購物車，從光滑的磁磚<b>斜斜地</b>推上地毯。先碰到地毯的那個輪子先變慢，另一邊還在快跑，車頭就歪掉了。",
          "光也一樣。光在空氣裡跑得快，在水和玻璃裡跑得慢。<b>斜斜地</b>從一種介質進到另一種介質，速率一變，方向就跟著偏折。這叫做光的<b>折射</b>。",
          { t: "tiles", v: [
            { em: "🌬️", h: "空氣（和真空差不多）", p: "光跑得最快，每秒約 30 萬公里。" },
            { em: "💧", h: "水", p: "比較慢，大約是空氣中的四分之三。" },
            { em: "🧊", h: "玻璃", p: "更慢，大約是空氣中的三分之二。" } ] },
          { t: "chant", v: "光速：空氣 ＞ 水 ＞ 玻璃", sub: "速率改變，是折射的原因" } ] },
        { h: "📐 折射的規則", body: [
          { t: "svg", v: svgRefract },
          { t: "list", v: [
            "<b>法線</b>：在光射到界面的那一點，畫一條和界面<b>垂直</b>的線（和反射一樣）。",
            "<b>入射角</b>：入射線和法線的夾角。<b>折射角</b>：折射線和法線的夾角。",
            "入射線和折射線分別在法線的<b>兩側</b>、界面的兩邊。",
            "光到界面時，通常<b>一部分反射、一部分折射</b>，兩件事同時發生。" ] },
          { t: "svg", v: svgBend },
          { t: "vs", v: [
            { h: "快 → 慢（空氣 → 水、空氣 → 玻璃）", p: "折射線<b>偏向法線</b>，折射角 ＜ 入射角。" },
            { h: "慢 → 快（水 → 空氣、玻璃 → 空氣）", p: "折射線<b>偏離法線</b>，折射角 ＞ 入射角。" } ] },
          { t: "chant", v: "哪一邊跑得慢，哪一邊的角就小", sub: "慢的那一邊，光線比較貼近法線" },
          { t: "trap", v: "<b>垂直</b>射入界面時，光<b>不會偏折</b>（入射角、折射角都是 0°）。但是它的速率還是變了，只是方向沒變。" },
          { t: "h3", v: "換你接著做：光從空氣射向水面，光和水面的夾角是 30°" },
          { t: "fill", id: "f1", q: "① 入射角是幾度？", ans: ["60"], unit: "°", how: "打數字，再按「對答案」", hint: "入射角是和法線的夾角：90 − 30", e: "90° − 30° ＝ 60°。和上週反射的陷阱一樣：角度看法線，不看界面。" },
          { t: "ask", id: "a1", q: "② 這道光進到水裡之後，折射角會是下面哪一種？", o: ["大於 60°", "等於 60°", "小於 60°"], a: 2, how: "點一個，馬上告訴你對不對", e: "空氣 → 水是快 → 慢，折射線偏向法線，所以折射角小於入射角（60°）。" } ] },
        { h: "🔁 光路可以倒著走", body: [
          "如果光沿著原來的折射線<b>倒著射回去</b>，它會沿著原來的入射線出去。這叫做<b>光的可逆性</b>。",
          "所以「空氣 → 水」的圖倒過來看，就是「水 → 空氣」的圖，不用背兩次。",
          { t: "tiles", v: [
            { em: "🎵", h: "折射時不變的", p: "<b>頻率</b>不變（光的顏色不變）。" },
            { em: "🏃", h: "折射時會變的", p: "<b>速率</b>改變，斜射時<b>方向</b>也改變。" } ] } ] },
        { h: "🐟 水裡的魚，比你看到的還要深", body: [
          { t: "svg", v: svgDepth },
          "魚身上的光從水裡射到空氣，在水面<b>偏離法線</b>轉了個彎才進到眼睛。可是大腦以為光是直直過來的，就順著光線往回找，結果找到的位置比真正的魚<b>淺</b>。你看到的是魚的<b>虛像</b>。",
          { t: "tiles", v: [
            { em: "🏊", h: "泳池變淺", p: "從岸上看池底，比實際的淺。看起來的深度叫<b>視深</b>，視深 ＜ 實深。" },
            { em: "🥢", h: "筷子折斷", p: "水裡那一段筷子的像往上移，所以看起來在水面折斷、往上彎。" },
            { em: "🎣", h: "叉魚要瞄下面", p: "魚真正的位置比看到的深，魚叉要瞄準看到的魚的<b>下方</b>。" },
            { em: "🌅", h: "看到的太陽", p: "陽光穿過大氣層時也會折射，所以太陽其實還在地平線下，我們就看到它了。" } ] },
          { t: "reveal", ref: "g1", v: "筷子沒有彎，是<b>光</b>轉彎了。水裡那段筷子的光從水進到空氣時偏折，看起來的位置比實際的高，所以像是斷掉。" },
          { t: "trap", v: "反過來，<b>魚從水裡看岸上的人</b>，會覺得人比實際的<b>高</b>。兩邊看對方，都是往「離界面比較遠」還是「比較近」？記這句：<b>從空氣看水裡，變淺；從水裡看空氣，變高。</b>" },
          { t: "sim", id: "m1", src: PHET("bending-light", 1), title: "折射模擬：讓雷射光鑽進水裡", who: PHET_WHO,
            how: "第一次打開要等十幾秒。按雷射筆上的紅色按鈕發光，雷射筆可以用手指拖著轉。",
            missions: [
              "按雷射筆上的<b>紅色按鈕</b>：光進到下面的水裡，是偏向中間那條虛線（法線），還是偏離？",
              "把雷射筆拖到<b>正上方</b>，讓光垂直射下去：光有沒有轉彎？",
              "把下面的「材料」從「水」改成「<b>玻璃</b>」：光彎得比較多還是比較少？",
              "把上面的材料改成「水」、下面改成「<b>空氣</b>」（光從水射進空氣）：這次是偏向還是偏離法線？" ] } ] },
        { h: "📝 考試會這樣問", body: [
          { t: "list", v: [
            "生活說法：「光進到水裡會轉彎」。考卷寫法：「光由空氣<b>斜向</b>射入水中，因<b>速率改變</b>而發生偏折，折射線<b>偏向法線</b>」。",
            "考卷常問折射的原因：答案是「光在不同介質中的<b>速率不同</b>」。",
            "考卷常問「下列何者<b>不是</b>折射造成的」：影子、針孔成像（光的直進）和平面鏡成像（反射）是最常見的答案。",
            "考卷愛用的陷阱字眼：「光由空氣進入水中，<b>必定</b>會偏折」→ 錯，垂直射入就不偏折。" ] } ] },
      ] },

    // ───────── ② 透鏡成像 ─────────
    { id: "s2", nav: "② 透鏡成像", intro: "這一站是整章的<b>主角</b>，段考一定考。先認識兩種透鏡，再學三條特殊光線，最後用一張「成像總圖」把所有情況收起來。內容比較多，看累了就休息一下再回來。",
      cards: [
        ...vid(2, "兩種透鏡和三條特殊光線：凸透鏡會聚、凹透鏡發散。"),
        ...vid(3, "透鏡成像總圖：物體放在哪一區，就成什麼像。"),
        tube("想要老師帶著一題一題畫圖的話，這兩支是完整的一堂課。很長，挑一段看就好。",
          yt("8ceLW89O6-Q", "國二上 4-3 透鏡成像（完整一堂課・第 1 段）", "國中理化自學", { len: "43 分", tag: "完整版" }),
          yt("rbWkZU5B9yY", "國二上 4-3 透鏡成像（完整一堂課・第 2 段）", "國中理化自學", { len: "31 分", tag: "完整版" })),
        { h: "🔎 兩種透鏡：凸透鏡和凹透鏡", body: [
          "透鏡是用玻璃或塑膠做的，光穿過它的時候折射兩次（進去一次、出來一次）。摸摸看就能分辨：",
          { t: "svg", v: svgTwoLens },
          { t: "vs", v: [
            { h: "凸透鏡（會聚透鏡）", p: "中間厚、邊緣薄。把平行光<b>會聚</b>到一點，這一點叫<b>焦點</b>。放大鏡、老花眼鏡、相機鏡頭都是。" },
            { h: "凹透鏡（發散透鏡）", p: "中間薄、邊緣厚。把平行光<b>發散</b>開，看起來像從鏡子前面的焦點射出來。近視眼鏡就是。" } ] },
          { t: "tiles", v: [
            { em: "⭕", h: "鏡心 O", p: "透鏡的正中心。通過鏡心的光<b>不偏折</b>。" },
            { em: "➖", h: "主軸", p: "通過鏡心、和鏡面垂直的那條線。" },
            { em: "🎯", h: "焦點 F", p: "平行主軸的光會聚的那一點。透鏡<b>左右兩邊各有一個</b>，離鏡心一樣遠。" },
            { em: "📏", h: "焦距 f", p: "焦點到鏡心的距離。2F 就是離鏡心<b>兩倍焦距</b>的地方。" } ] },
          { t: "trap", v: "上週的面鏡是<b>反射</b>：凹面鏡會聚、凸面鏡發散。這週的透鏡是<b>折射</b>：<b>凸透鏡會聚、凹透鏡發散</b>。兩個剛好相反，考卷最愛把它們放在一起。" },
          { t: "table", head: ["", "會聚光", "發散光"], rows: [["面鏡（反射）", "凹面鏡", "凸面鏡"], ["透鏡（折射）", "<b>凸透鏡</b>", "<b>凹透鏡</b>"]] },
          { t: "chant", v: "鏡子凹的聚光，透鏡凸的聚光", sub: "能把太陽光聚成一個亮點、點燃紙的：凹面鏡、凸透鏡" } ] },
        { h: "☀️ 怎麼量凸透鏡的焦距？", body: [
          { t: "list", v: [
            "把凸透鏡拿到太陽下，讓鏡面<b>正對太陽</b>（太陽光可以當作平行光）。",
            "在透鏡後面放一張紙，前後移動，直到紙上的光點<b>最小、最亮</b>。",
            "這個亮點就是焦點。量出<b>亮點到鏡心的距離</b>，就是焦距。" ] },
          { t: "trap", v: "亮點的溫度很高，紙會燒焦。裝水的寶特瓶、玻璃球也像凸透鏡，放在車上或窗邊曬太陽可能引起火災。" },
          { t: "fill", id: "f2", q: "太陽光通過凸透鏡，在透鏡後面 12 cm 的地方聚成最小最亮的點。這個透鏡的兩倍焦距（2F）離鏡心幾公分？", ans: ["24"], unit: "cm", how: "打數字，再按「對答案」", hint: "焦距是 12 cm，兩倍焦距就是 12 × 2", e: "焦距 f ＝ 12 cm，2f ＝ 24 cm" } ] },
        { h: "✏️ 三條特殊光線（畫圖找像就靠它）", body: [
          "物體上的一點會往四面八方發光，全部畫出來太亂了。只要挑其中<b>走法最好記</b>的幾條，畫出來的交點就是像的位置。",
          { t: "svg", v: svgThreeRays },
          { t: "list", v: [
            "① <b>平行主軸</b>射入 → 折射後<b>通過另一邊的焦點</b>。",
            "② <b>通過鏡心</b> → <b>直直走</b>，不偏折。",
            "③ 先<b>通過焦點</b>再射入 → 折射後<b>和主軸平行</b>（是 ① 倒過來，光路可逆）。" ] },
          { t: "guide", v: "只要畫其中兩條（通常是 ① 和 ②），交點就是像的頂端。從交點往主軸畫一支箭頭，像就畫好了。" },
          { t: "chant", v: "平行的過焦點，過焦點的變平行，過鏡心的不轉彎" } ] },
        { h: "⭐ 成像總圖：物體放在哪一區？", body: [
          "凸透鏡會成什麼像，<b>只看物體離透鏡多遠</b>。用 F 和 2F 兩個點，把物體那一邊切成三區：",
          { t: "svg", v: svgZones },
          { t: "table", head: ["物體的位置", "像的位置", "像的性質", "用在哪裡"], rows: [
            ["非常遠（平行光）", "另一側的焦點上", "一個亮點（實像）", "量焦距、聚光"],
            ["① 2F 外", "另一側 F～2F", "<b>倒立、縮小、實像</b>", "照相機、眼睛"],
            ["剛好在 2F", "另一側 2F", "倒立、<b>一樣大</b>、實像", "用來求焦距"],
            ["② F～2F", "另一側 2F 外", "<b>倒立、放大、實像</b>", "投影機"],
            ["剛好在 F", "不成像", "折射後變成平行光", "探照燈"],
            ["③ F 內", "和物體<b>同一側</b>", "<b>正立、放大、虛像</b>", "放大鏡"] ] },
          { t: "chant", v: "一倍焦距分虛實，兩倍焦距分大小", sub: "F 是實像和虛像的分界；2F 是縮小和放大的分界" },
          { t: "chant", v: "實像都倒立，虛像都正立", sub: "看到「倒立」就是實像，看到「正立」就是虛像（透鏡、面鏡都適用）" },
          { t: "guide", v: "有沒有發現：物體區和像區是<b>交叉對應</b>的。物體在遠的那一區（2F 外），像就在近的那一區（F～2F）；物體在近的那一區，像就跑到遠的那一區。" } ] },
        { h: "🖼️ 三種情況各畫一次", body: [
          { t: "h3", v: "① 物體在 2F 外：倒立、縮小、實像" },
          { t: "svg", v: svgCaseFar },
          "照相機拍遠方的人、眼睛看東西，都是這一種。像比物體小，所以整個人才裝得進小小的底片（感光元件）和視網膜。",
          { t: "h3", v: "② 物體在 F～2F 之間：倒立、放大、實像" },
          { t: "svg", v: svgCaseMid },
          "投影機把小小的畫面放大投到布幕上，就是這一種。因為像是倒的，所以投影片（或機器裡的畫面）要<b>倒著放</b>。",
          { t: "h3", v: "③ 物體在 F 內：正立、放大、虛像" },
          { t: "svg", v: svgCaseNear },
          "折射後的兩條光線<b>越走越開</b>，在另一邊永遠不會相交，所以紙屏接不到像。但是眼睛從另一邊往透鏡看，大腦順著光線往回找（虛線），就看到一個放大的、正的像。這就是<b>放大鏡</b>。",
          { t: "reveal", ref: "g2", v: "放大鏡是凸透鏡。遠方的景物在 <b>2F 外</b>，所以看到的是<b>倒立、縮小</b>的像。它只有在東西放得很近（F 內）的時候，才會放大。" },
          { t: "ask", id: "a2", q: "一個凸透鏡的焦距是 10 cm。把蠟燭放在透鏡前 15 cm 的地方，會成什麼像？", o: ["倒立、縮小、實像", "倒立、放大、實像", "正立、放大、虛像"], a: 1, how: "先想 F 和 2F 各是幾公分，再看 15 落在哪一區", e: "F ＝ 10 cm、2F ＝ 20 cm。15 在 10 和 20 之間，是 ② 區：倒立、放大、實像。" },
          { t: "ask", id: "a3", q: "同一個透鏡（焦距 10 cm），蠟燭改放在透鏡前 6 cm 的地方呢？", o: ["倒立、縮小、實像", "倒立、放大、實像", "正立、放大、虛像"], a: 2, how: "點一個，馬上告訴你對不對", e: "6 比焦距 10 小，在 ③ 區（F 內）：正立、放大、虛像，紙屏接不到。" } ] },
        { h: "🧲 實像和虛像差在哪？", body: [
          { t: "vs", v: [
            { h: "實像", p: "光線<b>真的會聚</b>在那裡。可以用<b>紙屏接到</b>。一定是<b>倒立</b>的（上下顛倒、左右也相反）。和物體在透鏡的<b>不同側</b>。" },
            { h: "虛像", p: "光線沒有真的到那裡，是<b>反向延長線</b>的交點。紙屏<b>接不到</b>，只能用眼睛透過透鏡看。一定是<b>正立</b>的。和物體在透鏡的<b>同一側</b>。" } ] },
          { t: "trap", v: "虛像<b>看得到</b>，只是<b>接不到</b>。考卷寫「虛像無法用眼睛看見」是錯的。平面鏡裡的你就是虛像，你每天都看得到。" } ] },
        { h: "🏃 物體移動，像怎麼跟著動？", body: [
          "只看實像的時候（物體在 F 外），記一句話就夠：",
          { t: "chant", v: "物近、像遠、像變大", sub: "物體往透鏡（焦點）靠近 → 像離透鏡越來越遠，而且越來越大" },
          { t: "list", v: [
            "蠟燭從很遠慢慢移向焦點：紙屏要<b>往後退</b>（遠離透鏡）才接得到清楚的像，像越來越大。",
            "倒過來，蠟燭遠離透鏡：紙屏要<b>靠近</b>透鏡，像越來越小。",
            "蠟燭越過焦點、進到 F 內：紙屏上<b>突然接不到像</b>了，要改從紙屏那一邊透過透鏡看，才看得到正立放大的虛像。" ] },
          { t: "sim", id: "m2", src: PHET("geometric-optics", 1), title: "透鏡模擬：拖著鉛筆找像", who: PHET_WHO,
            how: "第一次打開要等十幾秒。鉛筆可以用手指拖；主軸上兩個黃色的點是焦點；上面中間兩個按鈕可以換凸透鏡、凹透鏡。",
            missions: [
              "把鉛筆拖到離透鏡<b>很遠</b>的地方：右邊的像是正的還是倒的？比鉛筆大還是小？",
              "把鉛筆慢慢拖<b>靠近左邊的黃點（焦點）</b>：像是越來越大還是越來越小？離透鏡越來越遠還是近？",
              "把鉛筆拖到黃點和透鏡<b>中間</b>：像跑到哪一邊了？是正的還是倒的？",
              "按上面中間右邊的按鈕換成<b>凹透鏡</b>，把鉛筆前後拖：像有沒有變成倒的或放大過？" ] } ] },
        { h: "🧪 實驗 4-1：透鏡成像", body: [
          { t: "svg", v: svgBench },
          { t: "lab", h: "課本實驗的做法", steps: [
            "先量焦距：用太陽光（或很遠的燈）找出最小最亮的點，量它到鏡心的距離。",
            "在光具座上依序放<b>蠟燭、凸透鏡、紙屏</b>，把燭焰、透鏡中心、紙屏中心調到<b>同一個高度</b>。",
            "把蠟燭放在 2F 外，<b>前後移動紙屏</b>，直到紙屏上的像最清楚，記下像的大小、正倒和像距。",
            "把蠟燭依序移到 2F、F～2F 之間、F、F 內，每次都重新移動紙屏找像。",
            "蠟燭在 F 內時紙屏接不到像：拿掉紙屏，從紙屏那一邊<b>透過透鏡往蠟燭看</b>。" ],
            think: "為什麼三個東西的中心要一樣高？（這樣像才會落在紙屏的正中央，不會跑到紙屏外面。）" },
          { t: "tiles", v: [
            { em: "✋", h: "遮住透鏡的上半部", p: "像還是<b>完整</b>的，只是<b>變暗</b>。因為物體每一點的光，還是可以從沒遮住的那一半通過。" },
            { em: "🕯️", h: "蠟燭越燒越短", p: "燭焰往下移，紙屏上的像會<b>往上移</b>（因為像是倒的）。" },
            { em: "🔄", h: "紙屏上的字", p: "實像不只上下顛倒，<b>左右也相反</b>。把「F」形的光源放上去，紙屏上是轉了半圈的 F。" },
            { em: "2️⃣", h: "用 2F 求焦距", p: "紙屏上的像和物體<b>一樣大</b>時，物距 ＝ 像距 ＝ 2f。把物距除以 2 就是焦距。" } ] },
          { t: "h3", v: "看學姊做一次" },
          { t: "list", v: [
            "蠟燭放在凸透鏡前 30 cm，紙屏上得到倒立、<b>一樣大</b>的實像。",
            "一樣大 → 物體剛好在 2F，所以 2f ＝ 30 cm，<b>f ＝ 15 cm</b>。",
            "如果把蠟燭移到透鏡前 20 cm：20 在 15 和 30 之間（F～2F）→ 倒立、放大、實像。" ] },
          { t: "fill", id: "f3", q: "蠟燭放在凸透鏡前 40 cm 時，紙屏上得到倒立、一樣大的實像。這個透鏡的焦距是幾公分？", ans: ["20"], unit: "cm", how: "打數字，再按「對答案」", hint: "一樣大 → 物體在 2F，所以 2f ＝ 40", e: "2f ＝ 40 cm，f ＝ 20 cm" },
          { t: "ask", id: "a4", q: "承上題（焦距 20 cm），把蠟燭移到透鏡前 50 cm 的地方，紙屏上的像是？", o: ["倒立、縮小、實像", "倒立、放大、實像", "紙屏上接不到像"], a: 0, how: "點一個，馬上告訴你對不對", e: "2F ＝ 40 cm，50 比 40 遠，在 2F 外：倒立、縮小、實像。" } ] },
        { h: "👓 凹透鏡成什麼像？", body: [
          { t: "svg", v: svgConcave },
          "凹透鏡只有一種結果，不用分區：不管物體放在哪裡，都是<b>正立、縮小、虛像</b>，像在物體和透鏡之間（和物體同一側）。",
          { t: "list", v: [
            "畫法：平行主軸的光折射後往外<b>發散</b>，把它<b>反向延長</b>（虛線）會通過物體這一側的焦點。",
            "通過鏡心的光一樣直直走。兩條線（一條虛線、一條實線）的交點就是像。" ] },
          { t: "table", head: ["怎麼分辨", "凸透鏡", "凹透鏡"], rows: [
            ["摸", "中間厚", "中間薄"],
            ["照太陽", "可以聚成一個亮點", "聚不起來，影子周圍一圈亮"],
            ["貼近書本看字", "字<b>放大</b>", "字<b>縮小</b>"],
            ["拿遠看遠方", "倒立縮小", "正立縮小"] ] } ] },
        { h: "📝 考試會這樣問", body: [
          { t: "list", v: [
            "生活說法：「拿近會放大，拿遠會倒過來」。考卷寫法：「物體位於<b>焦點內</b>成正立放大虛像；位於<b>兩倍焦距外</b>成倒立縮小實像」。",
            "考卷最常給數字：「焦距 10 cm，物體在鏡前 25 cm」。做法永遠一樣：<b>先寫出 F ＝ 10、2F ＝ 20，再看 25 落在哪一區</b>。",
            "考卷愛用的陷阱：「凸透鏡只能成實像」→ 錯（F 內是虛像）；「凸透鏡成的像都是放大的」→ 錯；「凹透鏡可以成實像」→ 錯。",
            "考卷常問：「下列哪一種鏡子<b>不可能</b>成放大的像？」凹透鏡、凸面鏡、平面鏡都不行。能放大的只有<b>凸透鏡和凹面鏡</b>（就是會聚光的那兩個）。",
            "考卷常問遮住透鏡一半：像<b>完整但變暗</b>，不會只剩一半。" ] } ] },
      ] },

    // ───────── ③ 光學儀器 ─────────
    { id: "s3", nav: "③ 光學儀器", intro: "學會成像總圖之後，這一站很輕鬆：相機、眼睛、放大鏡、顯微鏡，全部都是<b>凸透鏡成像</b>的應用，只是物體放在不同的區。",
      cards: [
        ...vid(4, "眼睛就是一台相機：近視、遠視戴什麼鏡片，放大鏡和顯微鏡怎麼放大。"),
        tube("韓斯老師這段四分半，把顯微鏡、照相機、眼睛、近視遠視和色光一次講完（後半段是下一站的內容）。",
          yt("LR-xGLb1eR8", "顯微鏡、照相機、眼睛、近視、遠視、色光與顏色", "韓斯頭殼", { s: 1815, e: 2086, len: "約 4 分半", tag: "重點" }),
          yt("oQpkTUPqPh0", "國二上 4-4 光學儀器（完整一堂課・第 1 段）", "國中理化自學", { len: "21 分", tag: "完整版" })),
        { h: "📷 照相機和眼睛：同一個原理", body: [
          "拍照的時候，人站在鏡頭的 <b>2F 外</b>，所以在感光元件上成<b>倒立、縮小的實像</b>。眼睛看東西也是同一件事。",
          { t: "table", head: ["", "照相機", "眼睛"], rows: [
            ["凸透鏡", "鏡頭", "<b>水晶體</b>（加上角膜）"],
            ["接像的地方（紙屏）", "底片、感光元件", "<b>視網膜</b>"],
            ["控制進光量", "光圈", "<b>瞳孔</b>（由虹膜控制大小）"],
            ["成的像", "倒立、縮小、實像", "倒立、縮小、實像"],
            ["怎麼對焦", "前後移動鏡頭（改變像距）", "改變水晶體的<b>厚薄</b>（改變焦距）"] ] },
          { t: "tiles", v: [
            { em: "🙃", h: "視網膜上的像是倒的", p: "但是大腦會自動把它「翻正」，所以我們覺得世界是正的。" },
            { em: "👁️", h: "看近的東西", p: "水晶體<b>變厚</b>（焦距變短），像才會剛好落在視網膜上。" },
            { em: "🏔️", h: "看遠的東西", p: "水晶體<b>變薄</b>（焦距變長）。看遠方時眼睛最放鬆。" } ] },
          { t: "trap", v: "相機對焦是<b>移動鏡頭</b>；眼睛對焦是<b>改變水晶體的厚薄</b>，眼球本身不會伸長縮短。這個差別常考。" } ] },
        { h: "👓 近視和遠視", body: [
          { t: "svg", v: svgEyes },
          { t: "vs", v: [
            { h: "近視：看不清楚遠的", p: "水晶體太厚（或眼球太長），光會聚得太早，像落在視網膜<b>前面</b>。戴<b>凹透鏡</b>先把光發散一點，像就往後移到視網膜上。" },
            { h: "遠視：看不清楚近的", p: "水晶體太薄（或眼球太短），光來不及會聚，像落在視網膜<b>後面</b>。戴<b>凸透鏡</b>先幫忙會聚，像就往前移到視網膜上。" } ] },
          { t: "list", v: [
            "<b>老花眼</b>：年紀大了水晶體變硬、調不厚，看近的東西模糊。和遠視一樣戴<b>凸透鏡</b>。",
            "怎麼看別人戴的是哪一種眼鏡？透過鏡片看他的臉：臉的輪廓<b>往內縮</b>是凹透鏡（近視）；<b>放大</b>是凸透鏡（遠視、老花）。" ] },
          { t: "chant", v: "近視像在前，戴凹透鏡；遠視像在後，戴凸透鏡" },
          { t: "ask", id: "a5", q: "阿嬤看報紙要把報紙拿得很遠才看得清楚。她的眼鏡是哪一種透鏡？", o: ["凸透鏡", "凹透鏡", "平面玻璃"], a: 0, how: "點一個，馬上告訴你對不對", e: "看近的不清楚是老花眼，像落在視網膜後面，要戴凸透鏡幫忙會聚。" } ] },
        { h: "🔍 放大鏡", body: [
          "放大鏡就是一片凸透鏡。把東西放在<b>焦點內</b>（③ 區），眼睛從另一邊看，看到<b>正立、放大的虛像</b>。",
          { t: "list", v: [
            "東西一定要在<b>一倍焦距以內</b>。拿太遠，超過焦點，像就倒過來了。",
            "在焦點內，東西<b>越靠近焦點</b>（離透鏡遠一點），像越大。" ] } ] },
        { h: "🔬 複式顯微鏡", body: [
          "顯微鏡用<b>兩片凸透鏡</b>接力放大：靠近標本的叫<b>物鏡</b>，靠近眼睛的叫<b>目鏡</b>。",
          { t: "tiles", v: [
            { em: "1️⃣", h: "物鏡：先放大一次", p: "標本放在物鏡的 F～2F 之間（② 區）→ 在鏡筒裡成<b>倒立、放大的實像</b>。" },
            { em: "2️⃣", h: "目鏡：再放大一次", p: "這個實像剛好落在目鏡的焦點內（③ 區）→ 目鏡像放大鏡一樣，再把它放大成<b>虛像</b>。" },
            { em: "👀", h: "最後看到的", p: "<b>上下顛倒、左右相反、放大的虛像</b>。" },
            { em: "✖️", h: "放大倍率", p: "物鏡倍率 × 目鏡倍率。物鏡 40 倍、目鏡 10 倍，一共放大 400 倍。" } ] },
          { t: "trap", v: "顯微鏡下的像是<b>上下左右都顛倒</b>的。看到蟲在視野的<b>右上方</b>，其實牠在<b>左下方</b>；想把牠移到中間，玻片要往<b>右上方</b>推（往像所在的方向推）。" },
          { t: "fill", id: "f4", q: "顯微鏡的物鏡是 10 倍，目鏡是 15 倍。一共放大幾倍？", ans: ["150"], unit: "倍", how: "打數字，再按「對答案」", hint: "兩個倍率相乘", e: "10 × 15 ＝ 150 倍" } ] },
        { h: "🧾 一張表收起來", body: [
          { t: "table", head: ["儀器", "用什麼鏡", "物體在哪", "成什麼像"], rows: [
            ["照相機", "凸透鏡", "2F 外", "倒立、縮小、實像"],
            ["眼睛", "凸透鏡（水晶體）", "2F 外", "倒立、縮小、實像"],
            ["投影機", "凸透鏡", "F～2F", "倒立、放大、實像"],
            ["放大鏡", "凸透鏡", "F 內", "正立、放大、虛像"],
            ["顯微鏡", "兩片凸透鏡", "物鏡的 F～2F", "倒立、放大、虛像"],
            ["近視眼鏡", "凹透鏡", "—", "正立、縮小、虛像"] ] },
          { t: "guide", v: "望遠鏡也是用兩片透鏡（或加上面鏡）接力，把遠方的東西「拉近」來看。段考最常考的還是上面這幾個。" } ] },
        { h: "📝 考試會這樣問", body: [
          { t: "list", v: [
            "生活說法：「近視要戴眼鏡」。考卷寫法：「近視眼成像於視網膜<b>前方</b>，應配戴<b>凹透鏡</b>矯正」。",
            "考卷常問對應：眼睛的<b>水晶體</b>相當於相機的鏡頭，<b>視網膜</b>相當於底片，<b>瞳孔</b>相當於光圈。",
            "考卷常問：「下列哪一個儀器成的是<b>虛像</b>？」放大鏡、顯微鏡（最後的像）、近視眼鏡。相機、眼睛、投影機都是實像。",
            "考卷常問：「拍照時，人要再靠近鏡頭一點，像會怎樣？」物近、像遠、像變大。" ] } ] },
      ] },

    // ───────── ④ 顏色 ─────────
    { id: "s4", nav: "④ 顏色", intro: "最後一節：為什麼蘋果是紅的、葉子是綠的？答案是——顏色不在蘋果身上，在<b>光</b>裡面。",
      cards: [
        ...vid(5, "顏色藏在光裡：色散、三原色，還有紅光下的綠葉為什麼變黑。"),
        tube("這一節想聽完整講解的話，看這一支的前半段就夠了。",
          yt("sX9ykenTdBI", "國二上 4-5 色光與顏色（完整一堂課・第 1 段）", "國中理化自學", { len: "23 分", tag: "完整版" })),
        { h: "🌈 白光裡藏著七種顏色", body: [
          { t: "svg", v: svgPrism },
          "太陽光看起來是白的，其實是很多種色光混在一起。讓它通過<b>三稜鏡</b>，會被分成<b>紅、橙、黃、綠、藍、靛、紫</b>。這個現象叫做<b>色散</b>。",
          { t: "list", v: [
            "原因：不同色光在玻璃裡的<b>速率不一樣</b>，折射時偏折的程度就不同。",
            "<b>紅光</b>在玻璃裡跑得最快，偏折<b>最小</b>；<b>紫光</b>跑得最慢，偏折<b>最大</b>。",
            "光通過三稜鏡會折射兩次，兩次都往<b>厚的那一邊（底邊）</b>偏。" ] },
          { t: "tiles", v: [
            { em: "🌦️", h: "彩虹", p: "雨後空氣中的小水滴像一顆顆小三稜鏡。陽光在水滴裡<b>折射 → 反射 → 再折射</b>，就色散成彩虹。" },
            { em: "🧍", h: "看彩虹要背對太陽", p: "早上的彩虹在西邊，傍晚的彩虹在東邊。" },
            { em: "💿", h: "生活中的色散", p: "澆花的水霧、噴水池旁邊，背對太陽都看得到小彩虹。" } ] },
          { t: "chant", v: "紅橙黃綠藍靛紫，紅偏最少紫最多" },
          { t: "trap", v: "單一種色光（例如只有紅光）通過三稜鏡，<b>只會偏折，不會再色散</b>，出來還是紅光。" } ] },
        { h: "💡 光的三原色：紅、綠、藍", body: [
          { t: "svg", v: svgRGB },
          "用<b>紅、綠、藍</b>三種色光，照不同的比例混合，可以配出幾乎所有顏色的光。三種一樣強地疊在一起就是<b>白光</b>。",
          { t: "tiles", v: [
            { em: "📱", h: "手機螢幕", p: "用放大鏡看，螢幕是一顆顆紅、綠、藍的小燈。黃色的畫面其實是紅燈和綠燈一起亮。" },
            { em: "🎨", h: "和水彩不一樣", p: "水彩越混越暗；色光<b>越疊越亮</b>。考卷問「光的三原色」，答案是紅綠藍，不是紅黃藍。" } ] },
          { t: "sim", id: "m3", src: PHET("color-vision", 2), title: "色光模擬：調出三原色", who: PHET_WHO,
            how: "第一次打開要等十幾秒。右邊有紅、綠、藍三支手電筒，把旁邊的拉桿往上拉就會發光。人頭上的泡泡是他看到的顏色。",
            missions: [
              "只把<b>紅</b>和<b>綠</b>兩支拉到最上面：他看到什麼顏色？",
              "只把<b>綠</b>和<b>藍</b>兩支拉到最上面：他看到什麼顏色？",
              "把<b>三支</b>都拉到最上面：他看到什麼顏色？",
              "自己調調看：能不能調出橘色？紅、綠、藍各要多少？" ] } ] },
        { h: "🍎 東西的顏色是怎麼來的？", body: [
          { t: "svg", v: svgObjColor },
          { t: "h3", v: "不透明的東西：看它「反射」什麼色光" },
          { t: "list", v: [
            "紅蘋果：只<b>反射紅光</b>，其他色光被吸收。反射的紅光進到眼睛，我們就看到紅色。",
            "<b>白色</b>的東西：<b>所有色光都反射</b>。照什麼光，就變什麼顏色（紅光下的白紙是紅的）。",
            "<b>黑色</b>的東西：<b>所有色光都吸收</b>，沒有光反射出來，所以是黑的。" ] },
          { t: "h3", v: "透明的東西：看它讓什麼色光「通過」" },
          { t: "list", v: [
            "紅色玻璃紙：只讓<b>紅光通過</b>，其他色光被擋住（吸收）。",
            "白光先通過紅色玻璃紙、再遇到綠色玻璃紙：紅光過不去，<b>幾乎沒有光</b>，看起來是暗的。" ] },
          { t: "reveal", ref: "g3", v: "綠葉只會反射綠光。房間裡只有紅光，紅光被葉子吸收，<b>沒有光可以反射</b>，所以葉子看起來幾乎是<b>黑色</b>。" },
          { t: "h3", v: "判斷的三步驟（每一題都這樣想）" },
          { t: "list", v: [
            "第 1 步：<b>有什麼色光</b>照過來？（白光＝紅、綠、藍都有）",
            "第 2 步：這個東西<b>反射（或讓它通過）哪一種</b>色光？",
            "第 3 步：兩邊對得上，就看到那個顏色；對不上，就是<b>黑色</b>。" ] },
          { t: "table", head: ["照的光", "白紙", "紅蘋果", "綠葉", "黑字"], rows: [
            ["白光", "白", "紅", "綠", "黑"],
            ["紅光", "紅", "紅", "<b>黑</b>", "黑"],
            ["綠光", "綠", "<b>黑</b>", "綠", "黑"],
            ["藍光", "藍", "<b>黑</b>", "<b>黑</b>", "黑"] ] },
          { t: "ask", id: "a6", q: "透過一張<b>藍色</b>玻璃紙，看一張白紙上的<b>紅色</b>字。字看起來是什麼顏色？", o: ["紅色", "藍色", "黑色"], a: 2, how: "用三步驟想：紅字反射什麼光？這種光過得了藍色玻璃紙嗎？", e: "紅字只反射紅光，紅光通不過藍色玻璃紙，沒有光進到眼睛，所以字是黑色。旁邊的白紙會變成藍色。" },
          { t: "tiles", v: [
            { em: "👕", h: "夏天穿白色", p: "白色把大部分的光反射掉，吸收的熱比較少，比較涼。" },
            { em: "🧥", h: "冬天穿深色", p: "黑色把光都吸收，吸收的熱比較多，比較暖。" } ] } ] },
        { h: "📝 考試會這樣問", body: [
          { t: "list", v: [
            "生活說法：「蘋果是紅的」。考卷寫法：「紅色不透明物體<b>只反射紅光</b>，吸收其他色光」。",
            "考卷最常問：「在暗室中，用<b>綠光</b>照射白底紅字的卡片，看到什麼？」白底反射綠光 → <b>綠底</b>；紅字不反射綠光 → <b>黑字</b>。",
            "考卷常問色散：「白光通過三稜鏡，偏折最大的是？」<b>紫光</b>。「色散的原因？」各色光在玻璃中的<b>速率不同</b>。",
            "考卷常問彩虹：太陽光在水滴中經過<b>折射、反射、折射</b>；看彩虹要<b>背對太陽</b>。" ] } ] },
      ] },

    // ───────── 練習 ─────────
    { id: "s5", nav: "🧪 練習", intro: "最後一次的 30 分鐘：先做兩個小實驗（8 分），再去上方「⚔️ 闖關」打三個小偷、到錯題本補刀（15 分，做不完下次接著做），最後手寫 2 題、講出場券（7 分）。",
      cards: [
        { h: "🪙 浮上來的硬幣", body: [
          { t: "lab", h: "實驗 1：折射讓硬幣現身", steps: [
            "在一個不透明的碗（或馬克杯）底放一枚硬幣。",
            "眼睛慢慢往後、往下移，直到<b>剛好看不到</b>硬幣（被碗的邊緣擋住），頭停住不要動。",
            "請家人慢慢往碗裡倒水（硬幣不要被沖走）。看看發生什麼事。" ],
            think: "硬幣明明沒有動，為什麼又看得到了？這和「泳池看起來比較淺」是同一件事嗎？" },
          { t: "text", id: "x0", q: "倒水之後看到了什麼？你覺得為什麼？", how: "做完實驗再打，一兩句就好" } ] },
        { h: "➡️ 會掉頭的箭頭", body: [
          { t: "lab", h: "實驗 2：水杯就是凸透鏡", steps: [
            "在紙上畫一個大大的、朝右的箭頭「→」。",
            "拿一個<b>圓柱形</b>的透明杯子裝滿水，放在箭頭前面。",
            "把紙<b>貼在杯子後面</b>，透過水看箭頭；再把紙慢慢<b>往後拿遠</b>，一邊看箭頭的變化。" ],
            think: "紙貼著杯子時，箭頭是放大還是縮小、方向有沒有變？拿遠之後，箭頭變成朝哪一邊？對照成像總圖，紙是從哪一區移到哪一區？" },
          { t: "text", id: "x5", q: "紙拿遠之後，箭頭變成什麼樣子？", how: "一兩句就好" } ] },
        { h: "⚔️ 接著去闖關（約 15 分鐘）", body: [
          { t: "how", v: "點最上面一排的「⚔️ 闖關」，打倒三個小偷（🌱 歪歪水怪 → 📘 顛倒鏡片師 → 🔥 偷色大王，越後面越難）；被躲開的題目到「📕 錯題」重做到對，補上最後一刀。做完再回到這一站，繼續下面的手寫題和出場券。" } ] },
        { h: "✍️ 手寫 2 題（要畫圖）", body: [
          { t: "write", id: "w1", q: "① 畫一條水平的水面，上面是空氣、下面是水。畫一道光從空氣<b>斜斜</b>射進水裡：畫出法線、入射線、折射線，標出入射角和折射角，並寫出哪一個角比較大。" },
          { t: "write", id: "w2", q: "② 畫一個凸透鏡和主軸，在兩邊標出 F 和 2F。把一支箭頭（物體）畫在 <b>2F 外</b>，用「平行主軸」和「通過鏡心」兩條光線找出像，並在旁邊寫出像的三個性質。" } ] },
        { h: "🎟️ 出場券：用自己的話說", body: [
          { t: "text", id: "x1", q: "1. 泳池的水為什麼看起來比實際的淺？" },
          { t: "text", id: "x2", q: "2. 凸透鏡的物體放在 2F 外、F～2F、F 內，各成什麼像？" },
          { t: "text", id: "x3", q: "3. 近視的人，像落在視網膜的前面還是後面？要戴哪一種透鏡？" },
          { t: "text", id: "x4", q: "4. 為什麼綠色的葉子在紅光下看起來是黑的？" },
          { t: "guide", v: "講不出來的那一題，回去那一站再看一次卡片，再回來寫。" } ] },
        { h: "📤 最後一步：傳給爸爸", body: [
          { t: "submit", how: "按下面的按鈕 → 選 <b>LINE</b> → 選爸爸 → 傳送。平板會把你這份的闖關成績、猜謎、填空、手寫和出場券整理成一張圖傳出去。" },
          { t: "guide", v: "傳完這一份就結束了！下週的考前衝刺包會把第 3、4 章再整個跑一次，加油 👋" } ] },
      ] },
  ],
  flash: [
    ["折射", "光從一種介質斜射入另一種介質，因速率改變而偏折"],
    ["折射的原因", "光在不同介質中的速率不同"],
    ["光速大小", "空氣（真空）＞ 水 ＞ 玻璃"],
    ["折射角", "折射線和法線的夾角"],
    ["空氣 → 水（快 → 慢）", "偏向法線，折射角 ＜ 入射角"],
    ["水 → 空氣（慢 → 快）", "偏離法線，折射角 ＞ 入射角"],
    ["光垂直射入界面", "不偏折，但速率仍然改變"],
    ["折射時不變的是", "頻率"],
    ["視深和實深", "從空氣看水中的物體：視深 ＜ 實深（看起來比較淺）"],
    ["水中的筷子看起來", "在水面折斷、水裡的部分往上彎"],
    ["凸透鏡", "中間厚、邊緣薄，會聚光線"],
    ["凹透鏡", "中間薄、邊緣厚，發散光線"],
    ["焦距", "焦點到鏡心的距離"],
    ["平行主軸的光通過凸透鏡", "折射後通過另一側的焦點"],
    ["通過鏡心的光", "不偏折，直直走"],
    ["凸透鏡：物體在 2F 外", "倒立、縮小、實像（照相機、眼睛）"],
    ["凸透鏡：物體在 2F 上", "倒立、相等、實像（像也在 2F）"],
    ["凸透鏡：物體在 F～2F", "倒立、放大、實像（投影機）"],
    ["凸透鏡：物體在 F 上", "不成像（折射後成平行光）"],
    ["凸透鏡：物體在 F 內", "正立、放大、虛像（放大鏡）"],
    ["凹透鏡成的像", "一律是正立、縮小、虛像"],
    ["實像和虛像怎麼分", "實像倒立、紙屏接得到；虛像正立、紙屏接不到"],
    ["一倍焦距、兩倍焦距", "一倍焦距分虛實，兩倍焦距分大小"],
    ["遮住凸透鏡的一半", "像仍然完整，只是變暗"],
    ["眼睛的水晶體、視網膜", "相當於相機的鏡頭（凸透鏡）、底片"],
    ["近視", "像在視網膜前，戴凹透鏡"],
    ["遠視、老花", "像在視網膜後，戴凸透鏡"],
    ["複式顯微鏡看到的像", "上下顛倒、左右相反的放大虛像"],
    ["色散", "白光通過三稜鏡分成紅橙黃綠藍靛紫"],
    ["色散時偏折最大、最小", "紫光最大、紅光最小"],
    ["光的三原色", "紅、綠、藍；三色等量混合成白光"],
    ["紅光 ＋ 綠光", "黃光"],
    ["不透明物體的顏色", "由它反射的色光決定"],
    ["透明物體的顏色", "由能通過它的色光決定"],
    ["白色物體、黑色物體", "白色反射所有色光；黑色吸收所有色光"],
    ["紅光照綠葉", "看起來是黑色（沒有綠光可以反射）"],
  ],
  order: [
    { t: "透鏡成像實驗的步驟", items: ["用平行光量出凸透鏡的焦距", "在光具座上依序放蠟燭、凸透鏡、紙屏", "把燭焰、透鏡中心、紙屏中心調到同一個高度", "移動紙屏，直到像最清楚", "記錄像的大小、正倒和像距"] },
    { t: "蠟燭從遠處移向凸透鏡，依序看到的像", items: ["倒立縮小實像（2F 外）", "倒立相等實像（2F 上）", "倒立放大實像（F～2F）", "不成像（F 上）", "正立放大虛像（F 內）"] },
    { t: "色散後的色光：偏折由小到大", items: ["紅", "橙", "黃", "綠", "藍", "靛", "紫"] },
    { t: "光的速率：由快到慢", items: ["在空氣中", "在水中", "在玻璃中"] },
  ],
  quizHow: "📝 怎麼作答：每題<b>點一個</b>你覺得對的答案，答對就打中小偷一下，馬上會告訴你原因，再按「下一關」。三個對手：🌱 歪歪水怪 → 📘 顛倒鏡片師 → 🔥 偷色大王，<b>越後面越難，最後一個就是段考程度</b>，被躲開很正常！沒答對的題目會放進「📕 錯題」，回去重做到對就能補刀。一共 30 題，做不完沒關係，進度會自動存起來，下次接著打。",
  quiz: [
    // 🌱 看懂 9
    { tag: "看懂", s: "筷子斜插進水杯裡，看起來好像在水面折斷了。這是光的哪一種現象？", o: ["反射", "折射", "直進", "色散"], a: 1, e: "水裡那段筷子的光從水進到空氣時偏折（折射），看起來的位置比實際的高，所以像是折斷。" },
    { tag: "看懂", s: "光在下列哪一個地方跑得最快？", o: ["空氣", "水", "玻璃", "三個地方都一樣快"], a: 0, e: "光速：空氣（接近真空）＞ 水 ＞ 玻璃。就是因為速率不一樣，光才會折射。" },
    { tag: "看懂", s: "站在岸邊看游泳池的池底，覺得池水的深度和實際比起來怎樣？", o: ["比實際的深", "和實際一樣", "有時深有時淺", "比實際的淺"], a: 3, e: "池底的光從水進到空氣時偏離法線，大腦順著光線往回找，找到的位置比較淺。所以視深小於實深，下水要小心。" },
    { tag: "看懂", s: "放大鏡是用哪一種鏡片做的？", o: ["凹透鏡", "平面玻璃", "凸透鏡", "凸面鏡"], a: 2, e: "放大鏡是凸透鏡：中間厚、邊緣薄。東西放在焦點內，就看到正立放大的虛像。" },
    { tag: "看懂", s: "太陽光通過凸透鏡之後會怎樣？", o: ["會聚到一點", "往四周散開", "沿原路折回去", "分成七種顏色"], a: 0, e: "凸透鏡會把平行光會聚到焦點。往四周散開是凹透鏡；分成七色要用三稜鏡。" },
    { tag: "看懂", s: "近視的人戴的眼鏡，是哪一種透鏡？", o: ["凸透鏡", "凹透鏡", "凹面鏡", "平面鏡"], a: 1, e: "近視的像落在視網膜前面，要用凹透鏡先把光發散一點，像才會往後移到視網膜上。" },
    { tag: "看懂", s: "太陽光通過三稜鏡，被分成紅橙黃綠藍靛紫。這個現象叫做什麼？", o: ["反射", "漫射", "色散", "會聚"], a: 2, e: "白光被分成各種色光叫做色散，原因是不同色光在玻璃裡的速率不同、偏折程度不同。" },
    { tag: "看懂", s: "光的三原色是哪三種？", o: ["紅、黃、藍", "紅、橙、黃", "黃、綠、紫", "紅、綠、藍"], a: 3, e: "色光的三原色是紅、綠、藍，三種等量疊在一起是白光。紅、黃、藍是顏料的說法，不是光。" },
    { tag: "看懂", s: "在白光下，蘋果看起來是紅色的，是因為蘋果怎麼樣？", o: ["反射紅光，吸收其他色光", "吸收紅光，反射其他色光", "自己會發出紅光", "讓紅光穿過去"], a: 0, e: "不透明物體的顏色由它反射的色光決定。蘋果反射紅光、吸收其他色光，所以看起來是紅的。" },
    // 📘 課本 12
    { tag: "課本", s: "光從空氣<b>斜向</b>射入水中，下列敘述何者正確？", o: ["折射線偏離法線，折射角大於入射角", "折射線偏向法線，折射角小於入射角", "光不會偏折，直直前進", "折射角等於入射角"], a: 1, e: "空氣 → 水是快 → 慢，折射線偏向法線，折射角比入射角小。偏離法線是水 → 空氣的情形。" },
    { tag: "課本", s: "光從空氣<b>垂直</b>射入水中，下列敘述何者正確？", o: ["方向不變，速率也不變", "方向改變，速率不變", "方向不變，速率變慢", "方向改變，速率變慢"], a: 2, e: "垂直射入時入射角是 0°，光不偏折；但是進到水裡，速率還是變慢了。" },
    { tag: "課本", s: "關於實像和虛像，下列敘述何者正確？", o: ["實像是正立的，虛像是倒立的", "虛像用眼睛看不到", "實像和虛像都可以用紙屏接到", "實像可以用紙屏接到，虛像不行"], a: 3, e: "實像是光線真的會聚而成，紙屏接得到，而且是倒立的。虛像是反向延長線的交點，紙屏接不到，但眼睛看得到（例如平面鏡裡的你）。" },
    { tag: "課本", s: "凸透鏡的焦距是 10 cm。把蠟燭放在透鏡前 <b>30 cm</b> 的地方，紙屏上的像是？", o: ["倒立、縮小、實像", "倒立、放大、實像", "正立、放大、虛像", "倒立、一樣大、實像"], a: 0, e: "F ＝ 10、2F ＝ 20。30 比 20 遠，在 2F 外：倒立、縮小、實像。一樣大要剛好放在 20 cm。" },
    { tag: "課本", s: "用放大鏡看螞蟻，想看到放大的螞蟻，螞蟻要放在哪裡？", o: ["兩倍焦距外", "一倍和兩倍焦距之間", "焦點內（一倍焦距以內）", "剛好在兩倍焦距上"], a: 2, e: "放大鏡要成正立放大的虛像，物體必須在焦點內。放在 F～2F 之間雖然也會放大，但那是倒立的實像，要用紙屏接。" },
    { tag: "課本", s: "把物體放在<b>凹透鏡</b>前面，不管放在哪裡，看到的像都是？", o: ["倒立、縮小、實像", "正立、縮小、虛像", "正立、放大、虛像", "要看物體放在哪一區"], a: 1, e: "凹透鏡只會成正立、縮小的虛像，不用分區。正立放大虛像是凸透鏡（物體在焦點內）。" },
    { tag: "課本", s: "眼睛的構造和照相機很像。眼睛裡相當於「底片（感光元件）」的是哪一個部位？", o: ["水晶體", "瞳孔", "角膜", "視網膜"], a: 3, e: "視網膜負責接住像，相當於底片。水晶體相當於鏡頭（凸透鏡），瞳孔相當於光圈。" },
    { tag: "課本", s: "遠視眼的成像位置和應該配戴的鏡片，下列何者正確？", o: ["像在視網膜後方，戴凸透鏡", "像在視網膜前方，戴凹透鏡", "像在視網膜後方，戴凹透鏡", "像在視網膜前方，戴凸透鏡"], a: 0, e: "遠視的光來不及會聚，像落在視網膜後面，要戴凸透鏡幫忙會聚。像在前方、戴凹透鏡是近視。" },
    { tag: "課本", s: "白光通過三稜鏡發生色散。偏折程度<b>最大</b>的是哪一種色光？", o: ["紅光", "黃光", "紫光", "綠光"], a: 2, e: "紫光在玻璃中速率最慢，偏折最大；紅光速率最快，偏折最小。" },
    { tag: "課本", s: "在暗室裡，只用<b>紅光</b>照一張白紙。白紙看起來是什麼顏色？", o: ["白色", "紅色", "黑色", "粉紅色"], a: 1, e: "白紙會反射所有色光。現在只有紅光照它，它就反射紅光，所以看起來是紅色。" },
    { tag: "課本", s: "把紅光和綠光一樣強地照在白色牆上的同一個地方，看起來是什麼顏色？", o: ["洋紅色", "青色", "白色", "黃色"], a: 3, e: "紅光 ＋ 綠光 ＝ 黃光。紅 ＋ 藍是洋紅，綠 ＋ 藍是青，三種都有才是白。" },
    { tag: "課本", s: "做凸透鏡成像實驗，紙屏上已經有清楚的像。用一張不透明的紙遮住透鏡的<b>上半部</b>，紙屏上的像會怎樣？", o: ["像仍然完整，但是變暗", "只剩下半部的像", "只剩上半部的像", "像完全消失"], a: 0, e: "物體每一點發出的光，仍然可以從沒被遮住的下半部通過、會聚成像，所以像還是完整的；只是通過的光變少，像變暗。" },
    // 🔥 段考挑戰 9
    { tag: "段考挑戰", s: "【題組】一道光從空氣射向水面，入射線和<b>水面</b>的夾角是 40°，如下圖。甲、乙、丙、丁是四條可能的路徑，其中乙是入射線的延長線，丁和法線重合。", src: svgRefrQ, s2: "光進入水中後，最可能沿著哪一條路徑前進？", o: ["甲", "乙", "丙", "丁"], a: 2, e: "空氣 → 水，折射線偏向法線：比原來的方向（乙）更靠近法線，但不會和法線重合（丁）。所以是丙。甲是偏離法線，那是水 → 空氣才會發生。" },
    { tag: "段考挑戰", s: "【題組・承上圖】", src: svgRefrQ, s2: "關於這道光，下列敘述何者正確？", o: ["入射角是 50°，折射角小於 50°", "入射角是 40°，折射角小於 40°", "入射角是 50°，折射角大於 50°", "入射角是 40°，折射角等於 40°"], a: 0, e: "兩步：入射角是和法線的夾角，90° − 40° ＝ 50°；空氣 → 水偏向法線，折射角小於入射角，所以小於 50°。選 40° 是把和水面的夾角當成入射角。" },
    { tag: "段考挑戰", s: "漁夫站在岸上，看到水裡有一條魚，想用魚叉叉牠。魚叉應該瞄準哪裡？", o: ["看到的魚的上方", "正對著看到的魚", "看到的魚的左邊", "看到的魚的下方"], a: 3, e: "看到的是魚的虛像，位置比真正的魚淺。真正的魚在更深的地方，所以要瞄準看到的魚的下方。" },
    { tag: "段考挑戰", s: "【題組】小安做透鏡成像實驗：凸透鏡的焦距是 10 cm，固定在光具座 50 cm 的刻度上；蠟燭放在 20 cm 的刻度上，如下圖。", src: svgBenchQ, s2: "前後移動紙屏，找到最清楚的像。這個像的性質是？", o: ["倒立、放大、實像", "倒立、縮小、實像", "正立、放大、虛像", "倒立、一樣大、實像"], a: 1, e: "先算物距：50 − 20 ＝ 30 cm。F ＝ 10、2F ＝ 20，30 在 2F 外，所以是倒立、縮小、實像。直接拿刻度 20 當物距就會選錯。" },
    { tag: "段考挑戰", s: "【題組・承上圖】透鏡不動，把蠟燭移到 <b>35 cm</b> 的刻度上（圖上畫的是移動前的位置）。", src: svgBenchQ, s2: "要重新找到清楚的像，紙屏要怎麼移？像的大小怎麼變？", o: ["紙屏靠近透鏡，像變小", "紙屏靠近透鏡，像變大", "紙屏遠離透鏡，像變大", "紙屏不用動，像變大"], a: 2, e: "物距變成 50 − 35 ＝ 15 cm，落在 F～2F 之間：倒立、放大、實像，像在 2F 外。蠟燭靠近透鏡（物近），像就遠離透鏡、變大，所以紙屏要往遠離透鏡的方向移。" },
    { tag: "段考挑戰", s: "【題組・承上圖】透鏡不動，再把蠟燭移到 <b>44 cm</b> 的刻度上（圖上畫的是移動前的位置）。", src: svgBenchQ, s2: "下列敘述何者正確？", o: ["不管紙屏怎麼移都接不到像；從紙屏那一側透過透鏡看，可以看到正立放大的像", "紙屏放在很遠的地方，可以接到倒立放大的像", "紙屏貼近透鏡，可以接到正立放大的像", "紙屏接不到像，從哪裡看也都看不到像"], a: 0, e: "物距 ＝ 50 − 44 ＝ 6 cm，比焦距 10 cm 小，在焦點內：成正立放大的虛像。虛像紙屏接不到，但是眼睛從另一側透過透鏡看得到，這就是放大鏡的用法。" },
    { tag: "段考挑戰", s: "蠟燭放在凸透鏡前 24 cm 時，紙屏上出現倒立、<b>和燭焰一樣大</b>的像。如果把蠟燭移到透鏡前 <b>8 cm</b> 的地方，會成什麼像？", o: ["倒立、縮小、實像", "倒立、放大、實像", "倒立、一樣大、實像", "正立、放大、虛像"], a: 3, e: "兩步：一樣大代表物體在 2F，所以 2f ＝ 24 cm，f ＝ 12 cm。8 cm 比焦距 12 cm 小，在焦點內：正立、放大、虛像。" },
    { tag: "段考挑戰", s: "下列關於透鏡和光學儀器的敘述，何者<b>錯誤</b>？", o: ["照相機和眼睛，成的都是倒立縮小的實像", "凸透鏡成的像一定是實像", "複式顯微鏡的物鏡和目鏡都是凸透鏡", "凹透鏡成的像一定是正立縮小的虛像"], a: 1, e: "凸透鏡在物體位於焦點內時，成的是正立放大的<b>虛像</b>（放大鏡），所以「一定是實像」是錯的。其他三句都正確。" },
    { tag: "段考挑戰", s: "一張白色卡片上印著紅色的字。在暗室裡只用<b>綠光</b>照這張卡片，看到的卡片是什麼樣子？", o: ["白底紅字", "綠底紅字", "綠底黑字", "黑底綠字"], a: 2, e: "兩步：白底反射所有色光，現在只有綠光，所以底是綠色；紅字只反射紅光，綠光被它吸收，沒有光反射，所以字是黑色。" },
  ],
  assets: EPS.flatMap((n) => ["mp4", "jpg"].map((x) => ({ from: `${ANI}/w05-ep${n}.${x}`, to: `w05-ep${n}.${x}` }))),
  sources: [
    { t: "南一版 自然科學 2 上（課本目次：4-3 光的折射與透鏡、實驗 4-1 透鏡成像、4-4 光學儀器、4-5 光與顏色）", u: "https://www.nani.com.tw/" },
    { t: "PhET 互動模擬（科羅拉多大學波德分校，CC BY 4.0）", u: "https://phet.colorado.edu/zh_TW/" },
    { t: "彰化縣和美國中 115 學年度八年級自然課程計畫（南一版，章節與週次參考）", u: "https://www.curriculum.chc.edu.tw/years/115/plans/1392/views/5-8自然科學.pdf" },
  ],
};
