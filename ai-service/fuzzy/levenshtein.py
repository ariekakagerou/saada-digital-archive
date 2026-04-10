from rapidfuzz import process, fuzz
import logging

logger = logging.getLogger(__name__)

def perform_fuzzy_search(query: str, candidates: list[str], threshold: int = 60) -> list[dict]:
    """
    Perform fuzzy search using Levenshtein Distance (Ratio).
    Returns a list of dictionaries with match, score, and match_type.
    """
    try:
        if not candidates:
            return []

        # process.extract returns list of (match, score, index)
        results = process.extract(
            query, 
            candidates, 
            scorer=fuzz.ratio, 
            limit=10,
            score_cutoff=threshold
        )
        
        formatted_results = []
        for match, score, _ in results:
            formatted_results.append({
                "text": match,
                "score": score,
                "match_type": "Exact" if score == 100 else "Fuzzy"
            })
            
        return formatted_results

    except Exception as e:
        logger.error(f"Fuzzy search failed: {e}")
        return []
