// 正解した問題は除外。不正解は最後に戻して、正解するまで出題する。
export function advanceReviewQueue(queue: string[], questionId: string, isCorrect: boolean): string[] {
  const remaining = queue.filter((id) => id !== questionId);
  return isCorrect ? remaining : [...remaining, questionId];
}
