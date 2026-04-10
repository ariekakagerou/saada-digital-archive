import logging
from typing import Tuple

logger = logging.getLogger(__name__)

def calculate_cer(reference: str, hypothesis: str) -> Tuple[float, dict]:
    """
    Calculate Character Error Rate (CER) between reference and OCR result.
    
    CER = (Substitutions + Deletions + Insertions) / Total Characters in Reference
    
    Args:
        reference: Ground truth text (correct text)
        hypothesis: OCR extracted text (predicted text)
    
    Returns:
        Tuple of (CER percentage, detailed metrics)
    """
    try:
        # Remove extra whitespace and convert to lowercase for fair comparison
        ref = reference.strip().lower()
        hyp = hypothesis.strip().lower()
        
        # Calculate Levenshtein distance (edit distance)
        distance, operations = levenshtein_distance(ref, hyp)
        
        # Calculate CER
        if len(ref) == 0:
            cer = 0.0 if len(hyp) == 0 else 100.0
        else:
            cer = (distance / len(ref)) * 100
        
        # Calculate accuracy
        accuracy = max(0, 100 - cer)
        
        # Detailed metrics
        metrics = {
            "cer": round(cer, 2),
            "accuracy": round(accuracy, 2),
            "edit_distance": distance,
            "reference_length": len(ref),
            "hypothesis_length": len(hyp),
            "operations": operations
        }
        
        logger.info(f"CER Calculated: {cer:.2f}% | Accuracy: {accuracy:.2f}%")
        
        return cer, metrics
    
    except Exception as e:
        logger.error(f"CER calculation failed: {e}")
        return 0.0, {}


def levenshtein_distance(s1: str, s2: str) -> Tuple[int, dict]:
    """
    Calculate Levenshtein distance between two strings.
    Returns the minimum number of edits (insertions, deletions, substitutions)
    needed to transform s1 into s2.
    
    Args:
        s1: First string (reference)
        s2: Second string (hypothesis)
    
    Returns:
        Tuple of (distance, operations count)
    """
    len1, len2 = len(s1), len(s2)
    
    # Create a matrix to store distances
    dp = [[0] * (len2 + 1) for _ in range(len1 + 1)]
    
    # Initialize base cases
    for i in range(len1 + 1):
        dp[i][0] = i  # Deletions
    for j in range(len2 + 1):
        dp[0][j] = j  # Insertions
    
    # Fill the matrix
    for i in range(1, len1 + 1):
        for j in range(1, len2 + 1):
            if s1[i-1] == s2[j-1]:
                # Characters match, no operation needed
                dp[i][j] = dp[i-1][j-1]
            else:
                # Take minimum of three operations
                dp[i][j] = 1 + min(
                    dp[i-1][j],      # Deletion
                    dp[i][j-1],      # Insertion
                    dp[i-1][j-1]     # Substitution
                )
    
    # Backtrack to count operations
    operations = count_operations(dp, s1, s2)
    
    return dp[len1][len2], operations


def count_operations(dp: list, s1: str, s2: str) -> dict:
    """
    Backtrack through the DP matrix to count specific operations.
    
    Returns:
        Dictionary with counts of substitutions, deletions, and insertions
    """
    i, j = len(s1), len(s2)
    substitutions = 0
    deletions = 0
    insertions = 0
    
    while i > 0 or j > 0:
        if i > 0 and j > 0 and s1[i-1] == s2[j-1]:
            # Match, move diagonally
            i -= 1
            j -= 1
        elif i > 0 and j > 0 and dp[i][j] == dp[i-1][j-1] + 1:
            # Substitution
            substitutions += 1
            i -= 1
            j -= 1
        elif i > 0 and dp[i][j] == dp[i-1][j] + 1:
            # Deletion
            deletions += 1
            i -= 1
        elif j > 0 and dp[i][j] == dp[i][j-1] + 1:
            # Insertion
            insertions += 1
            j -= 1
        else:
            break
    
    return {
        "substitutions": substitutions,
        "deletions": deletions,
        "insertions": insertions,
        "total_errors": substitutions + deletions + insertions
    }


def calculate_wer(reference: str, hypothesis: str) -> Tuple[float, dict]:
    """
    Calculate Word Error Rate (WER) between reference and OCR result.
    
    WER = (Substitutions + Deletions + Insertions) / Total Words in Reference
    
    Args:
        reference: Ground truth text
        hypothesis: OCR extracted text
    
    Returns:
        Tuple of (WER percentage, detailed metrics)
    """
    try:
        # Split into words
        ref_words = reference.strip().lower().split()
        hyp_words = hypothesis.strip().lower().split()
        
        # Calculate word-level Levenshtein distance
        distance, operations = levenshtein_distance_words(ref_words, hyp_words)
        
        # Calculate WER
        if len(ref_words) == 0:
            wer = 0.0 if len(hyp_words) == 0 else 100.0
        else:
            wer = (distance / len(ref_words)) * 100
        
        accuracy = max(0, 100 - wer)
        
        metrics = {
            "wer": round(wer, 2),
            "accuracy": round(accuracy, 2),
            "edit_distance": distance,
            "reference_words": len(ref_words),
            "hypothesis_words": len(hyp_words),
            "operations": operations
        }
        
        logger.info(f"WER Calculated: {wer:.2f}% | Accuracy: {accuracy:.2f}%")
        
        return wer, metrics
    
    except Exception as e:
        logger.error(f"WER calculation failed: {e}")
        return 0.0, {}


def levenshtein_distance_words(words1: list, words2: list) -> Tuple[int, dict]:
    """
    Calculate Levenshtein distance at word level.
    """
    len1, len2 = len(words1), len(words2)
    dp = [[0] * (len2 + 1) for _ in range(len1 + 1)]
    
    for i in range(len1 + 1):
        dp[i][0] = i
    for j in range(len2 + 1):
        dp[0][j] = j
    
    for i in range(1, len1 + 1):
        for j in range(1, len2 + 1):
            if words1[i-1] == words2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    
    # Count operations (simplified version)
    total_errors = dp[len1][len2]
    operations = {
        "substitutions": 0,
        "deletions": 0,
        "insertions": 0,
        "total_errors": total_errors
    }
    
    return dp[len1][len2], operations
