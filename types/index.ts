export interface Position {
  latitude: number;
  longitude: number;
}

/**
 * @property {string} stop - 站点的name
 * @property {string[]} routes - 该站点经过的所有路线
 * @property {Position} position - The geographical location of the stop.
 */
export interface StopRoute {
  [stopName: string]: { routes: string[]; position: Position };
}
