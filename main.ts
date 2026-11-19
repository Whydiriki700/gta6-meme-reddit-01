// gta6-meme-reddit-01 entry (Node 22, standard library only).
//
// The entry itself is a post on Reddit, not this program: the meme was made
// in this session, it goes out as an image post with make.fun in its title
// or text (the play code lives in the posting account's profile
// description), and POST.json at the repo root names the post's address.
// The house reads the post from Reddit, takes its first picture with its
// title and text, and hands them to the judge. All this program has to do
// is hand POST.json to the grader: copy it from the repository into the
// output directory, byte for byte.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const postFile = join(botDir, 'POST.json');
const outFile = join(outputDir, 'POST.json');

let size: number;
try {
  size = statSync(postFile).size;
} catch {
  fail(`POST.json not found in ${botDir}: post the meme and fill in POST.json first.`);
}
if (size === 0) {
  fail(`POST.json in ${botDir} is empty: fill in the post's address first.`);
}

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(postFile, outFile);
} catch (err) {
  fail(`could not copy ${postFile} to ${outFile}: ${(err as Error).message}`);
}

// The gate refuses a POST.json that is not a JSON object with a url, so
// catch a placeholder or a broken file here instead of at submission.
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(outFile, 'utf8'));
} catch {
  fail(`${outFile} is not valid JSON: fill in the post's address first.`);
}
if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
  fail(`${outFile} has no url string: fill in the post's address first.`);
}
