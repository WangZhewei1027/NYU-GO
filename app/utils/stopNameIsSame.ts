export default function stopNameIsSame(
  stopNameA: string,
  stopNameB: string
): boolean {
  if (!stopNameA || !stopNameB) {
    return false;
  }
  if (
    stopNameA.trim().toLowerCase().includes(stopNameB.trim().toLowerCase()) ||
    stopNameB.trim().toLowerCase().includes(stopNameA.trim().toLowerCase())
  ) {
    return true;
  }
  return false;
}
