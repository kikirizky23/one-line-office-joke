// One line about office life: a meeting that ends early, and the
// time it saves getting spent on scheduling another meeting to
// talk about why the first one ended early. The joke is the loop:
// the meeting exists to discuss meetings, and even escaping one
// early just feeds the next. It is the kind of line you send a
// colleague right after the call ends.
//
// The script writes that line to entry.txt and nothing else. It
// runs the same way every time: no clock, no randomness, no
// network, nothing read from outside this file.
//
// Node standard library only.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The joke itself: exactly one line.
const JOKE =
  'The meeting ended early, so we spent the saved time scheduling another meeting to discuss why it ended early.';

// Longest line this bounty accepts, in characters.
const LIMIT = 200;

function lineLength(text: string): number {
  // Spread into code points so a character outside the basic
  // multilingual plane counts once, the way the bounty counts it.
  return [...text].length;
}

function jokeIsOneLine(): boolean {
  const length = lineLength(JOKE);
  if (length === 0) {
    process.stderr.write('[joke] the line is empty\n');
    return false;
  }
  if (length > LIMIT) {
    process.stderr.write(`[joke] the line is ${length} characters, over the ${LIMIT} limit\n`);
    return false;
  }
  if (JOKE.includes('\n') || JOKE.includes('\r')) {
    process.stderr.write('[joke] the joke must be a single line\n');
    return false;
  }
  return true;
}

function targetDirectory(): string {
  const given = process.env.MAKEFUN_OUTPUT_DIR;
  return given !== undefined && given !== '' ? given : '/output';
}

function run(): void {
  if (!jokeIsOneLine()) {
    process.exit(1);
  }
  const directory = targetDirectory();
  mkdirSync(directory, { recursive: true });
  const target = join(directory, 'entry.txt');
  writeFileSync(target, JOKE, 'utf-8');
  const back = readFileSync(target, 'utf-8');
  if (back !== JOKE) {
    process.stderr.write('[joke] entry.txt does not match the joke\n');
    process.exit(1);
  }
  const digest = createHash('sha256').update(back, 'utf-8').digest('hex');
  process.stdout.write(`[joke] wrote ${target} (${lineLength(JOKE)} characters, sha256 ${digest})\n`);
}

run();
