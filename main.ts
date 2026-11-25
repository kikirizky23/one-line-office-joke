// One line about a meeting that ends early.
//
// The joke is a loop. A meeting finishes ahead of schedule, which
// ought to be good news, except the time it frees up does not go
// back to real work. It goes to booking another meeting, and that
// meeting exists for one reason only: to talk about why the first
// one ended early. So the meeting never really ends. It just holds
// a follow-up about itself. That is the whole gag, and it works
// because anyone who has worked in an office has watched a calendar
// fill up in exactly this way. It is the kind of line you send to
// a colleague the moment you hang up.
//
// This program writes that one line to a file called entry.txt and
// then stops. It is deliberately boring: it takes no arguments,
// reads no input, touches no network, looks at no clock, and rolls
// no dice. The same run always produces the same bytes.
//
// Node standard library only.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  'The meeting ended early, so we spent the saved time scheduling another meeting to discuss why it ended early.';

const MAX_LENGTH = 200;
const OUT_FILE = 'entry.txt';

function countChars(s: string): number {
  return Array.from(s).length;
}

function checkLine(): string | null {
  // Count once and reuse the number: spreading the string three
  // times would do the same work three times for no reason.
  const n = countChars(LINE);
  if (n === 0) return 'the line is empty';
  if (n > MAX_LENGTH) {
    return `the line is ${n} characters, longer than the ${MAX_LENGTH} allowed`;
  }
  if (LINE.includes('\n') || LINE.includes('\r')) return 'the line must not contain a newline';
  return null;
}

function destination(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv !== '') return fromEnv;
  return '/output';
}

function main(): void {
  const problem = checkLine();
  if (problem !== null) {
    process.stderr.write(`entry: ${problem}\n`);
    process.exit(1);
  }
  const dir = destination();
  mkdirSync(dir, { recursive: true });
  const file = join(dir, OUT_FILE);
  writeFileSync(file, LINE, 'utf-8');
  const reread = readFileSync(file, 'utf-8');
  if (reread !== LINE) {
    process.stderr.write('entry: the file on disk does not match the line\n');
    process.exit(1);
  }
  const hash = createHash('sha256').update(reread, 'utf-8').digest('hex');
  process.stdout.write(`entry: wrote ${file} (${countChars(LINE)} characters, sha256 ${hash})\n`);
}

main();
