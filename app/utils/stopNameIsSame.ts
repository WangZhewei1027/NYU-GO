/* eslint-disable @typescript-eslint/naming-convention */
const specialStops: { [key: string]: string } = {
  "Cleveland & Spring St.": "Cleveland Pl & Spring St.",
  "80 Lafayette Street": "80 Lafayette St.",
  "20th St & Loop Exit": "20th Street At Loop Exit",
  "Cadman Plaza & Clark St.": "Cadman Plaza & Clark Street",
  "6 MetroTech": "Metro Tech Way",
  "Lafayette & E. 4th St": "Lafayette & E 4th St.",
  "Third Avenue At 11th Street (SB)": "3rd Ave. at 11th St. (SB)",
  "Third Avenue At 11th Street (NB)": "3rd Ave. at 11th St. (NB)",
  "Third Avenue At 13th Street": "3rd Ave. at 13th St.",
  "14th Street At Third Avenue": "14th St. at 3rd Ave.",
  "Third Avenue At 14th Street": "3rd Ave. at 14th St.",
  "14th St At Irving Place EB": "14th St. at Irving Place (EB)",
  "14th St At Irving Place WB": "14th St. at Irving Place (WB)",
  "Third Avenue At 17th Street S": "3rd Ave. at 17th St.",
  "Third Avenue At 17th Street N": "3rd Ave. at 17th St.",
  "14th Street At 1st Avenue": "14th St. & 1st Ave.",
  "14th Street At Avenue A": "14th St. & Ave. A",
  "14th Street At Avenue B": "14th St. & Ave. B",
  "Avenue C At 14th Street": "Ave. C & 14th St.",
  "Avenue C At 16th Street": "Ave. C & 16th St.",
  "Avenue C At 18th Street": "Ave C & 18th St.",
  "First Avenue At 17th Street": "1St. Ave. at 17th St.",
  "First Avenue At 24th Street": "1st Ave. at 24th St.",
  "First Avenue At 26th Street": "1st Ave. at 26th St.",
  "Third Avenue At 30th Street": "3rd Ave. at 30th St.",
  "Lexington Avenue At 31st Street": "Lexington Ave. at 31st St.",
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
