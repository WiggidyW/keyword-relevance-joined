# keyword-relevance-joined

Keyword-based relevance scoring that evaluates all keywords in a single prompt.

## Overview

This function evaluates how relevant content is to a set of keywords by joining all keywords into a single Vector Completion task. An ensemble of LLMs votes on the relevance level, and the weighted votes are combined into a final score.

## Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `keywords` | `string[]` | Yes | Keywords to evaluate relevance against (minimum 1) |
| `content` | `string \| image \| video \| audio \| file \| array` | Yes | Content to evaluate for relevance |

### Supported Content Types

- **Text** - Plain text strings
- **Image** - Image content
- **Video** - Video content
- **Audio** - Audio content
- **File** - File content
- **Array** - Multiple content pieces of any of the above types

## Output

A scalar value between 0 and 1:

| Score | Interpretation |
|-------|----------------|
| 1.0 | Extremely relevant |
| 0.5 | Somewhat relevant |
| 0.0 | Not relevant |

## Example

```json
{
  "input": {
    "keywords": ["healthcare", "AI", "diagnostics"],
    "content": "Machine learning algorithms are increasingly being used to analyze medical imaging for early disease detection."
  }
}
```

## How It Works

1. **Prompt Construction**: All keywords are joined into a single prompt:
   ```
   How relevant is the following content with regards to:
   - healthcare
   - AI
   - diagnostics

   "[content]"
   ```

2. **Ensemble Voting**: Multiple LLMs vote on one of three responses:
   - "Extremely Relevant"
   - "Somewhat Relevant"
   - "Not Relevant"

3. **Score Calculation**:
   ```
   score = scores[Extremely Relevant] + (scores[Somewhat Relevant] * 0.5)
   ```

## Default Profile

The default profile uses 14 LLMs with **reasoning models weighted higher**:

| Model | Weight | Notes |
|-------|--------|-------|
| `google/gemini-3-flash-preview` | 1.0 | Reasoning model |
| `anthropic/claude-haiku-4.5` | 1.0 | Reasoning model |
| `openai/gpt-5-mini` | 1.0 | Reasoning model |
| `openai/gpt-4.1-nano` (x3 temps) | 0.2 | Fast model, varied temperatures |
| `google/gemini-2.5-flash-lite` (x3 temps) | 0.2 | Fast model, varied temperatures |
| `x-ai/grok-4.1-fast` (x3 temps) | 0.2 | Fast model, reasoning disabled |
| `deepseek/deepseek-v3.2` | 0.2 | With logprobs |
| `openai/gpt-4o-mini` | 0.2 | With logprobs |

## When to Use

Use `keyword-relevance-joined` when:
- You want a holistic evaluation considering all keywords together
- Keyword relationships matter (e.g., "machine" + "learning" should be understood as a concept)
- Each Ensemble LLM gets one completion (vs. one completion per keyword in split)

## Related Functions

- [WiggidyW/keyword-relevance](https://github.com/WiggidyW/keyword-relevance) - Combined joined + split evaluation
- [WiggidyW/keyword-relevance-split](https://github.com/WiggidyW/keyword-relevance-split) - Per-keyword evaluation
