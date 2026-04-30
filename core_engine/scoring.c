#include <stdio.h>

// Cette fonction sera appelée par Python.
// Elle prend des multiplicateurs et renvoie un score final.
float calculate_match_score(int base_score, float multiplier, int penalty) {
    float final_score = (base_score * multiplier) - penalty;

    // On s'assure que le score ne soit pas négatif
    if (final_score < 0) return 0.0f;

    return final_score;
}
