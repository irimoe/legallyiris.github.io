import { execSync } from "node:child_process";
import fs from "node:fs";

const commitHash = execSync("git rev-parse HEAD").toString().trim();
const buildTime = new Date().toISOString();

fs.writeFileSync(
	".env.production",
	`VITE_COMMIT_HASH=${commitHash}
VITE_BUILD_TIME=${buildTime}
`,
);

console.log(`build info generated:
  commit: ${commitHash}
  time: ${buildTime}`);
