#include <stdio.h>

float calculate_match_score(int base_score, float multiplier, int penalty) {
    float final_score = (base_score * multiplier) - penalty;

    if (final_score < 0) return 0.0f;

    return final_score;
}
