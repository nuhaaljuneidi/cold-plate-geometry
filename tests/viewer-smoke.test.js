const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const parts = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "parts.json"), "utf8"));
const geometryBase64 = fs.readFileSync(path.join(__dirname, "..", "geometry.b64.txt"), "utf8").trim();
const viewIds = ["all", "cut", "water", "fins", "stack", "chips"];

test("inline application script parses", () => {
  const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1])
    .filter(source => source.trim());
  assert.ok(inlineScripts.length >= 1);
  for (const source of inlineScripts) {
    assert.doesNotThrow(() => new Function(source));
  }
});

test("all view presets have buttons and teaching notes", () => {
  for (const id of viewIds) {
    assert.match(html, new RegExp(`data-view="${id}"`));
    assert.match(html, new RegExp(`${id}:\\{label:`));
  }
});

test("share, reset, and image-export controls are present", () => {
  for (const id of ["reset-view", "save-view", "copy-view", "view-note"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /searchParams\.set\("view",v\)/);
  assert.match(html, /searchParams\.get\("view"\)/);
});

test("page contains no AI co-author attribution", () => {
  assert.doesNotMatch(html, /Claude|Anthropic|Co-Authored-By/i);
});

test("HTML IDs are unique", () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.ok(ids.length > 0);
  assert.equal(new Set(ids).size, ids.length);
});

test("required local assets are referenced and present", () => {
  for (const file of ["favicon.svg", "parts.json", "geometry.b64.txt"]) {
    assert.match(html, new RegExp(file.replace(".", "\\.")));
    assert.ok(fs.statSync(path.join(__dirname, "..", file)).size > 0);
  }
});

test("part ranges and names are internally consistent", () => {
  assert.ok(Number.isInteger(parts.nverts) && parts.nverts > 0);
  assert.ok(Number.isInteger(parts.nidx) && parts.nidx > 0);
  assert.ok(Array.isArray(parts.parts) && parts.parts.length > 0);

  const names = new Set();
  for (const part of parts.parts) {
    assert.equal(typeof part.name, "string");
    assert.ok(!names.has(part.name), `duplicate part name: ${part.name}`);
    names.add(part.name);
    assert.ok(part.vstart >= 0 && part.vcount > 0 && part.vstart + part.vcount <= parts.nverts);
    assert.ok(part.istart >= 0 && part.icount > 0 && part.istart + part.icount <= parts.nidx);
    assert.equal(part.bbox.length, 6);
    assert.ok(part.bbox.every(Number.isFinite));
  }
});

test("geometry payload size matches its metadata", () => {
  const decoded = Buffer.from(geometryBase64, "base64");
  const expectedBytes = (parts.nverts * 3 + parts.nidx) * Float32Array.BYTES_PER_ELEMENT;
  assert.equal(decoded.byteLength, expectedBytes);
});
