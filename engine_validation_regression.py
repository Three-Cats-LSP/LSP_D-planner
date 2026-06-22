#!/usr/bin/env python3
"""
Engine validation regression — malformed gas fractions and dive profiles (GitHub #7).
Runs headless via Playwright against local index.html.

Usage: python engine_validation_regression.py
Exit 0 = all pass, 1 = failures.
"""

import sys
import threading
import http.server
import socketserver
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent

PASS = []
FAIL = []


def ok(msg):
    PASS.append(msg)
    print(f"  ✓ {msg}")


def fail(msg):
    FAIL.append(msg)
    print(f"  ✗ {msg}")


def start_server():
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(ROOT), **kwargs)

        def log_message(self, fmt, *args):
            pass

    httpd = socketserver.TCPServer(("127.0.0.1", 0), Handler)
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, port


def run_checks(page, port):
    page.goto(f"http://127.0.0.1:{port}/index.html?massiveSuite=1", wait_until="domcontentloaded")
    page.wait_for_function(
        "() => window.ZHLEngine && window.VPMEngine && window.validateEngineInputs",
        timeout=60000,
    )
    page.wait_for_timeout(3000)

    settings = {
        "metric": True,
        "gfLo": 30,
        "gfHi": 85,
        "stepSize": 3,
        "lastStop": 3,
        "minStopTime": 1,
    }

    results = page.evaluate(
        """(settings) => {
      const lv = (d, t, o2, he) => [{ depth: d, time: t, o2, he }];
      const zhl = (d, t, o2, he, gases) => window.ZHLEngine.calculate(lv(d, t, o2, he), gases || [], settings);
      const vpm = (d, t, o2, he, gases) => window.VPMEngine.calculate(lv(d, t, o2, he), gases || [], settings, 'VPMB');
      const out = {};

      out.valid = zhl(40, 25, 21, 0);
      out.badMixZhl = zhl(40, 25, 50, 60);
      out.badO2Zhl = zhl(40, 25, 150, 0);
      out.negO2Zhl = zhl(40, 25, -10, 0);
      out.negDepthZhl = zhl(-10, 25, 21, 0);
      out.zeroTimeZhl = zhl(40, 0, 21, 0);
      out.boundaryZhl = zhl(40, 25, 50, 50);
      out.badDecoZhl = zhl(40, 25, 21, 0, [{ o2: 50, he: 60 }]);
      out.badMixVpm = vpm(40, 25, 50, 60);
      out.negHeVpm = vpm(40, 25, 21, -5);
      out.nanO2Vpm = vpm(40, 25, NaN, 0);

      const dom = document.getElementById('decoGas');
      const prevMix = dom ? dom.value : null;
      const prevO2 = document.getElementById('botTrimixO2')?.value;
      const prevHe = document.getElementById('botTrimixHe')?.value;
      if (dom) dom.value = 'trimix';
      const o2El = document.getElementById('botTrimixO2');
      const heEl = document.getElementById('botTrimixHe');
      if (o2El) o2El.value = '50';
      if (heEl) heEl.value = '60';
      out.domInvalid = window.validateDomDecoGases();
      if (dom && prevMix != null) dom.value = prevMix;
      if (o2El && prevO2 != null) o2El.value = prevO2;
      if (heEl && prevHe != null) heEl.value = prevHe;

      return out;
    }""",
        settings,
    )

    if results["valid"].get("totalRuntime", 0) > 0 and not results["valid"].get("code"):
        ok("valid 40m/25min air produces schedule")
    else:
        fail(f"valid dive failed: {results['valid']}")

    for label, key, code in [
        ("ZHL O2+He>100%", "badMixZhl", "INVALID_GAS_FRACTIONS"),
        ("ZHL O2>100%", "badO2Zhl", "INVALID_GAS_FRACTIONS"),
        ("ZHL negative O2", "negO2Zhl", "INVALID_GAS_FRACTIONS"),
        ("ZHL negative depth", "negDepthZhl", "INVALID_DEPTH"),
        ("ZHL zero bottom time", "zeroTimeZhl", "INVALID_TIME"),
        ("ZHL invalid deco gas", "badDecoZhl", "INVALID_GAS_FRACTIONS"),
        ("VPM O2+He>100%", "badMixVpm", "INVALID_GAS_FRACTIONS"),
        ("VPM negative He", "negHeVpm", "INVALID_GAS_FRACTIONS"),
        ("VPM NaN O2", "nanO2Vpm", "INVALID_GAS_FRACTIONS"),
    ]:
        got = results[key].get("code")
        if got == code:
            ok(f"{label} → {code}")
        else:
            fail(f"{label}: expected {code}, got {got!r} ({results[key]})")

    boundary = results["boundaryZhl"]
    if not boundary.get("code") and boundary.get("totalRuntime", 0) > 0:
        ok("boundary 50/50 trimix (100% total) still calculates")
    else:
        fail(f"boundary 50/50 failed: {boundary}")

    dom = results["domInvalid"]
    if dom.get("ok") is False and any(e.get("code") == "INVALID_GAS_FRACTIONS" for e in dom.get("errors", [])):
        ok("validateDomDecoGases rejects invalid bottom trimix in DOM")
    else:
        fail(f"DOM gas validation failed: {dom}")


def main():
    from playwright.sync_api import sync_playwright

    print("Engine validation regression (GitHub #7)")
    print("=" * 50)

    httpd, port = start_server()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            run_checks(page, port)
            browser.close()
    finally:
        httpd.shutdown()

    print(f"\n{'─' * 50}")
    print(f"  Results: {len(PASS)} passed, {len(FAIL)} failed")
    print(f"{'─' * 50}\n")
    return 0 if not FAIL else 1


if __name__ == "__main__":
    sys.exit(main())
