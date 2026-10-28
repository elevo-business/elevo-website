// Quiz-Antworten in sessionStorage: überleben ein Neuladen, werden nach erfolgreichem Absenden gelöscht.
import { read, remove, write } from '../../neukundensystem/lib/storage';

const KEY = 'fr_quiz';

export interface SavedQuiz {
  step: number;
  answers: Record<string, string>;
}

export function loadQuiz(): SavedQuiz | null {
  try {
    const data = JSON.parse(read('session', KEY) ?? 'null') as SavedQuiz | null;
    return data && typeof data.answers === 'object' ? data : null;
  } catch {
    return null;
  }
}

export function saveQuiz(data: SavedQuiz): void {
  write('session', KEY, JSON.stringify(data));
}

export function clearQuiz(): void {
  remove('session', KEY);
}
