# Bug 2 / Bug 3 Comparative Regression Report

Date: 2026-06-23

## Scope

Compared two isolated worktrees:

- Baseline: `origin/main` at `e0d2a80`, current v2.20.30.
- Patched: same `e0d2a80` plus only:
  - Bug 2: remove unreachable `if (!levels || levels.length === 0)` after `validateEngineInputs()`.
  - Bug 3: reassert `ctx.win._zhlHeadless = true` around repeated ZHL harness calls in `lsp-test-harness.js` and `tests.html`.

The Bug 1 DOM field restore patch was intentionally excluded from this A/B copy.

## Full Suite Timing

Each suite was run 3 times from a fresh process per run.

| Suite | Baseline result | Baseline mean | Patched result | Patched mean |
| --- | ---: | ---: | ---: | ---: |
| `audit.py` | 394/394, all 3 pass | 2.61s | 394/394, all 3 pass | 4.78s |
| `engine_validation_regression.py` | 27/27, all 3 pass | 20.10s | 27/27, all 3 pass | 12.04s |
| `export_regression.py` | 59/59, all 3 pass | 44.44s | 59/59 on clean reruns | 25.35s pass-run mean |

Patched export had one transient first-run Playwright/app readiness failure:

- `ReferenceError: domDepthToM is not defined`, then later one concurrent rerun hit `Cannot set properties of null (setting 'innerHTML')`.
- Sequential reruns passed `59/59`.
- This matches the already-known export-regression load/DOM readiness flake and is not attributable to Bug 2 or Bug 3.

Timing conclusion: no reliable performance regression from the patches. The patched worktree was generally faster in browser suites, but the spread is dominated by Playwright/browser startup variance rather than these tiny code changes.

## Long-Lived Headless Harness Loop

Method:

- Loaded `bench-harness.html`, which embeds the app through `lsp-test-harness.js`.
- Ran 50 repeated `LSPTestHarness.calc(..., 'ZHLC_GF')` calls in the same browser context.
- Sampled Chromium JS heap before and after each iteration with exposed GC.
- Checked result repeatability and whether `ctx.win._zhlHeadless` remained true after each call.

| Metric | Baseline | Patched |
| --- | ---: | ---: |
| Iterations | 50 | 50 |
| Calculation errors | 0 | 0 |
| Unique ZHL total runtime values | `[47]` | `[47]` |
| Headless guard drops | 50/50 | 0/50 |
| Mean call time | 19.98ms | 15.04ms |
| Call time stdev | 14.15ms | 4.29ms |
| Mean heap delta / iteration | -3,257 bytes | +6,853 bytes |
| Heap delta stdev | 71,216 bytes | 62,404 bytes |

Repeatability conclusion:

- Decompression result repeatability is identical: every run returned total runtime `47`.
- No calculation errors in either variant.
- Bug 3 is confirmed as a real harness state leak: baseline loses `_zhlHeadless` after every ZHL call.
- Patched harness preserves `_zhlHeadless` after every ZHL call.
- Heap drift is small and noisy in both variants. No monotonic leak signal was observed over 50 iterations.

## Stability Impact

Bug 2:

- No behavior or stability change in measured suites.
- The guard is unreachable because `validateEngineInputs()` already rejects empty levels.
- Fix is safe cleanup and keeps error shape ownership centralized.

Bug 3:

- Does not change ZHL numerical output.
- Does materially improve harness repeatability by preserving the persistent headless guard.
- Main risk without the fix is not decompression math corruption; it is test-infra/UI-adapter state ambiguity after the first ZHL harness call.

## Recommendation

Prioritize Bug 3 for the next release cycle if test harness reliability or external harness consumers matter. It has a clear, reproducible state leak and a low-risk fix.

Bug 2 does not need release-cycle priority by itself, but it should ride with the same patch because it is tiny, safe, and removes an unreachable alternate error path.

Neither patch shows evidence of runtime, memory, or decompression-output instability.

Raw data:

- `comparative_benchmark_report.json`
- `headless_loop_rerun.json`
