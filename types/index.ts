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

export const validFileNames = [
  "route_A_f.csv",
  "route_A_mt.csv",
  "route_A_w.csv",
  "route_B_f.csv",
  "route_B_mt.csv",
  "route_C_mt.csv",
  "route_E_f.csv",
  "route_E_mt.csv",
  "route_F_mt.csv",
  "route_G_f.csv",
  "route_G_mt.csv",
  "route_G_w.csv",
  "route_W_w.csv",
];
