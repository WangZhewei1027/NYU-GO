const specialStops: { [key: string]: string } = {
  "Cleveland & Spring St.": "Cleveland Pl & Spring St.",
  "80 Lafayette Street": "80 Lafayette St.",
  "20th St & Loop Exit":"20th Street At Loop Exit",
};

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
  } else if (
    specialStops[stopNameA.trim()] === stopNameB.trim() ||
    specialStops[stopNameB.trim()] === stopNameA.trim()
  ) {
    console.log(
      `Special stop match: "${stopNameA}" is considered the same as "${stopNameB}"`
    );
    return true;
  }
  return false;
}
