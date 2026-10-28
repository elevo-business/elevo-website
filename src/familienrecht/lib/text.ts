// Mini-Markup für Config-Texte: **fett** wird zu <strong>. Rückgabe als Teile, damit nie HTML aus der Config gerendert wird.
export function boldParts(text: string): { text: string; bold: boolean }[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => ({ text: part, bold: i % 2 === 1 })).filter((p) => p.text !== '');
}
