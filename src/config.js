// Main settings for the reviewer. Edit these values to change how the mock exam works.

// How many items the mock exam takes from each domain.
// The four numbers must add up to MOCK_TOTAL.
export const MOCK_SPLIT = {
  'math-logic': 13,
  'physics-circuits': 13,
  'technical-knowledge': 12,
  'abstract-reasoning': 12,
};

export const MOCK_TOTAL = 50;

// Time limit of the mock exam, in minutes.
export const MOCK_MINUTES = 60;

// Passing score as a fraction (0.6 means 60%).
export const PASS_RATE = 0.6;

// Choices for "How many questions?" in Practice mode. "all" means every matching item.
export const PRACTICE_COUNTS = [10, 20, 50, 'all'];
