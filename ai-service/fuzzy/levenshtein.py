from rapidfuzz import process, fuzz, utils
import logging

logger = logging.getLogger(__name__)

# OCR Homoglyph mapping (normalizes visually identical/similar OCR character typos for name/text matching)
OCR_HOMOGLYPH_MAP = str.maketrans({
    '0': 'o',
    '1': 'i',
    '|': 'i',
    '!': 'i',
    'l': 'i',
    '5': 's',
    '8': 'b',
    '3': 'e',
    '2': 'z',
    '@': 'a',
    '$': 's'
})

def normalize_ocr_homoglyphs(text: str) -> str:
    """
    Normalizes common OCR number-to-letter homoglyphs (e.g. '0' -> 'o', '1' -> 'i', '5' -> 's').
    """
    if not text:
        return ""
    return text.lower().translate(OCR_HOMOGLYPH_MAP)

def perform_fuzzy_search(query: str, candidates: list[str], threshold: int = 65) -> list[dict]:
    """
    Perform smart fuzzy search using Levenshtein Distance, Token Ratio, and OCR Homoglyph Normalization.
    Returns a list of dictionaries with text, score, and match_type.
    """
    try:
        if not candidates or not query:
            return []

        q_clean = query.strip().lower()
        q_words = q_clean.split()

        q_norm = normalize_ocr_homoglyphs(q_clean)
        q_norm_words = q_norm.split()
        
        formatted_results = []
        for cand in candidates:
            c_clean = cand.strip().lower()
            c_words = c_clean.split()
            if not c_words or not q_words:
                continue

            c_norm = normalize_ocr_homoglyphs(c_clean)
            c_norm_words = c_norm.split()

            # 1. Check exact match (raw or homoglyph normalized)
            if q_clean == c_clean or q_norm == c_norm:
                formatted_results.append({
                    "text": cand,
                    "score": 100.0,
                    "match_type": "Exact"
                })
                continue

            # 2. Compute standard word-level token score & full WRatio
            word_scores_std = [max(fuzz.ratio(qw, cw) for cw in c_words) for qw in q_words]
            token_score_std = sum(word_scores_std) / len(word_scores_std)
            full_score_std = fuzz.WRatio(q_clean, c_clean)
            score_std = max(token_score_std, full_score_std)

            # 3. Compute OCR Homoglyph normalized score (handles 0 <-> o, 1 <-> i/l, 5 <-> s, 8 <-> b)
            word_scores_norm = [max(fuzz.ratio(qw, cw) for cw in c_norm_words) for qw in q_norm_words]
            token_score_norm = sum(word_scores_norm) / len(word_scores_norm)
            full_score_norm = fuzz.WRatio(q_norm, c_norm)
            score_norm = max(token_score_norm, full_score_norm)

            # Pick the best alignment score
            final_score = max(score_std, score_norm)

            if final_score >= threshold:
                formatted_results.append({
                    "text": cand,
                    "score": round(final_score, 1),
                    "match_type": "Exact" if final_score >= 98.0 else "Fuzzy"
                })

        # Sort descending by score and take top 15
        formatted_results.sort(key=lambda x: x["score"], reverse=True)
        return formatted_results[:15]

    except Exception as e:
        logger.error(f"Fuzzy search failed: {e}")
        return []
