import numpy as np


# 🔹 Step 1: Normalize Stokes Parameters
def normalize_stokes(stokes_data):
    """
    Normalize each Stokes vector to unit length:
    S = [S1, S2, S3] / sqrt(S1^2 + S2^2 + S3^2)
    """
    norm = np.linalg.norm(stokes_data, axis=1, keepdims=True) + 1e-9
    return stokes_data / norm


# 🔹 Step 2: Compute NPSV (from paper formula)
def compute_npsv(stokes_data):
    """
    NPSV(t) = sqrt( (ΔS1)^2 + (ΔS2)^2 + (ΔS3)^2 )
    """
    # Normalize SOP
    stokes_data = normalize_stokes(stokes_data)

    # Compute differences between consecutive samples
    delta = np.diff(stokes_data, axis=0)

    # Apply formula
    npsv = np.sqrt(np.sum(delta**2, axis=1))

    return npsv


# 🔹 Step 3: Segment NPSV into windows (1000 samples)
def segment_npsv(npsv, segment_len=100):
    """
    Split NPSV into equal segments
    Each segment represents ~1 second
    """
    n_segments = len(npsv) // segment_len

    if n_segments == 0:
        return np.empty((0, segment_len))

    segments = npsv[:n_segments * segment_len].reshape(n_segments, segment_len)

    return segments


# 🔹 Step 4: Full Pipeline
def process_sop(stokes_data):
    """
    Full SOP processing pipeline:
    SOP → Normalize → NPSV → Segmentation
    """
    npsv = compute_npsv(stokes_data)
    segments = segment_npsv(npsv)

    return {
        "npsv": npsv,
        "segments": segments,
        "npsv_length": len(npsv),
        "segments_shape": segments.shape
    }