import { build } from "vite";

try {
  await build();
  console.log("LATTICE_BUILD_COMPLETE");
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
