const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
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
