#!/usr/bin/env python3
"""Score the soundtrack with Meta's Audiobox Aesthetics model (a proxy for listening, not a substitute).

    uv venv --python 3.12 .venv-aes && uv pip install --python .venv-aes/bin/python audiobox_aesthetics soundfile requests
    .venv-aes/bin/python scripts/score-music.py [files.mp3 ...]     # default: every track in public/music

Each file is loudness-matched (ffmpeg loudnorm, -18 LUFS, mono 44.1 kHz) so level does not sway the
score, cut into 10 s windows, and scored per window. Prints the mean of each axis (1-10):
CE content enjoyment, CU content usefulness, PC production complexity, PQ production quality,
plus the weakest window's CE. Use it to pick between generated takes: keep the higher CE.
"""
import glob, os, subprocess, sys, tempfile
import soundfile as sf, torch
from audiobox_aesthetics.infer import initialize_predictor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
files = sys.argv[1:] or sorted(glob.glob(os.path.join(ROOT, 'public', 'music', '*.mp3')))
predictor = initialize_predictor()
W = 10
print(f"{'track':26}   CE    CU    PC    PQ  minCE")
with tempfile.TemporaryDirectory() as tmp:
    for f in files:
        wav = os.path.join(tmp, 'x.wav')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f, '-af', 'loudnorm=I=-18:TP=-1.5', '-ac', '1', '-ar', '44100', wav], check=True)
        a, sr = sf.read(wav, dtype='float32')
        n = W * sr
        segs = [a[i:i + n] for i in range(0, len(a) - n + 1, n)] or [a]
        out = [predictor.forward([{'path': torch.from_numpy(s).unsqueeze(0), 'sample_rate': sr}])[0] for s in segs]
        mean = {k: sum(o[k] for o in out) / len(out) for k in ('CE', 'CU', 'PC', 'PQ')}
        print(f"{os.path.basename(f):26} " + ' '.join(f'{mean[k]:5.2f}' for k in ('CE', 'CU', 'PC', 'PQ')) + f" {min(o['CE'] for o in out):5.2f}", flush=True)
