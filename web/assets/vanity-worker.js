// Vanity mining worker. Each worker grinds random keys, deriving only the
// (cheap) npub per attempt, and reports the full key set once it hits.
import { noskey } from "./noskey.js";

let running = false;

self.onmessage = (e) => {
  const { cmd, prefix } = e.data;
  if (cmd === "stop") { running = false; return; }
  if (cmd !== "start") return;

  running = true;
  const target = prefix.toLowerCase();
  let count = 0;
  let lastReport = 0;

  // Grind in small slices so the worker stays responsive to "stop".
  function slice() {
    if (!running) return;
    const deadline = 250; // ms per slice
    const start = performance.now();
    while (performance.now() - start < deadline) {
      const priv = noskey.generatePrivateKey();
      const npub = noskey.npubFromPrivate(priv);
      count++;
      // npub1<prefix...> — match the human-visible part after the "npub1" hrp.
      if (npub.slice(5).startsWith(target)) {
        running = false;
        self.postMessage({ type: "found", count, keys: noskey.getAllKeys(priv) });
        return;
      }
    }
    const now = performance.now();
    if (now - lastReport > 200) {
      self.postMessage({ type: "progress", count });
      lastReport = now;
      count = 0;
    }
    setTimeout(slice, 0);
  }
  slice();
};
