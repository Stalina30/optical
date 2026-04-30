import numpy as np

def extract_signatures(segments):
    if segments is None or len(segments) == 0:
        print("⚠️ Invalid segments → generating fallback data")
        segments = np.random.rand(100, 50)

    signatures = []

    for seg in segments:
        fft_vals = np.fft.fft(seg)
        magnitude = np.abs(fft_vals)
        signatures.append(magnitude)

    return np.array(signatures)