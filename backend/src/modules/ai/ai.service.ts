import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  summarize(content = '') {
    const sentences = this.toSentences(content);
    const summary = sentences.slice(0, 3).join(' ') || content.slice(0, 240);

    return { summary };
  }

  rewrite(content = '') {
    const rewritten = content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim().replace(/\s+/g, ' '))
      .filter(Boolean)
      .join('\n\n');

    return { rewritten };
  }

  autoTag(content = '') {
    const stopWords = new Set([
      'about',
      'after',
      'again',
      'also',
      'and',
      'are',
      'because',
      'but',
      'for',
      'from',
      'have',
      'into',
      'not',
      'that',
      'the',
      'this',
      'with',
      'yang',
      'dan',
      'untuk',
      'dari',
      'ini',
      'itu',
    ]);
    const counts = new Map<string, number>();

    for (const word of content.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []) {
      if (!stopWords.has(word)) {
        counts.set(word, (counts.get(word) ?? 0) + 1);
      }
    }

    const tags = [...counts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 5)
      .map(([word]) => word);

    return { tags };
  }

  semanticSearch(query = '') {
    return {
      query,
      terms: [...new Set(query.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [])],
      results: [],
    };
  }

  private toSentences(content: string) {
    return content
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
  }
}
