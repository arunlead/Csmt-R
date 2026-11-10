/* Shared scroll state for the 3D world.
   The World component writes it every frame; the 3D scenes only read it. */
export const worldState = {
  progress: 0, // 0 to 1 across the whole world section (smoothed)
  velocity: 0, // progress units per second
};