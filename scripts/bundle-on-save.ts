import { watch } from "node:fs";
import { join, relative } from "node:path";
import { exec } from "node:child_process";

const targetDir = join(__dirname, "../packages/sotsial");
const excludedDirs = ["node_modules", "dist"];

console.log(`Watching for changes in ${targetDir}`);
console.log(`Will run 'bun bundle' when changes are detected...`);

const runBundle = () => {
	console.log("Changes detected, running bundle...");

	exec("bun bundle", { cwd: targetDir }, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			return;
		}

		if (stderr) {
			console.error(`stderr: ${stderr}`);
		}

		console.log(`Bundle completed:\n${stdout}`);
	});
};

// Debounce function to prevent multiple bundle runs for rapid changes
let timeout: NodeJS.Timeout | null = null;
const debounce = (func: () => void, wait: number) => {
	return () => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(func, wait);
	};
};

const debouncedBundle = debounce(runBundle, 300);

const watchDir = (dir: string) => {
	watch(dir, { recursive: true }, (_, filename) => {
		if (!filename) return;

		const relativePath = relative(targetDir, join(dir, filename));

		// Skip if change is in excluded directories
		if (
			excludedDirs.some((excludedDir) => relativePath.startsWith(excludedDir))
		) {
			return;
		}

		console.log(`Change detected: ${relativePath}`);
		debouncedBundle();
	});
};

// Start watching
watchDir(targetDir);
