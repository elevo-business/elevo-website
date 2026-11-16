// Auszeichnung in den Config-Texten: **fett**, *Akzent*
export const rich = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
