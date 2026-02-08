#!/usr/bin/env node

import { searchRepos, getRateLimit } from './fetcher.js';
import { analyze } from './analyze.js';
import { formatText, formatMarkdown, formatJson } from './format.js';

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('-')));
const positional = args.filter(a => !a.startsWith('-'));

if (flags.has('--help') || flags.has('-h')) {
  console.log(`gh-pulse — GitHub trending repos analysis

Usage: gh-pulse [options]

Options:
  -d, --days N      Look back N days (default: 7)
  -n, --count N     Number of repos to fetch (default: 30)
  -l, --language X  Filter by language
  -m, --markdown    Output as Markdown
  -j, --json        Output as JSON
  --rate-limit      Show API rate limit status
  -h, --help        Show this help

Examples:
  gh-pulse                     This week's trending repos
  gh-pulse -d 1                Last 24 hours
  gh-pulse -l python           Python repos only
  gh-pulse -d 3 -m             3-day pulse in Markdown`);
  process.exit(0);
}

// Parse flags
let daysBack = 7;
const daysIdx = args.findIndex(a => a === '-d' || a === '--days');
if (daysIdx !== -1 && args[daysIdx + 1]) daysBack = parseInt(args[daysIdx + 1], 10);

let count = 30;
const countIdx = args.findIndex(a => a === '-n' || a === '--count');
if (countIdx !== -1 && args[countIdx + 1]) count = parseInt(args[countIdx + 1], 10);

let language = null;
const langIdx = args.findIndex(a => a === '-l' || a === '--language');
if (langIdx !== -1 && args[langIdx + 1]) language = args[langIdx + 1];

const markdown = flags.has('-m') || flags.has('--markdown');
const json = flags.has('-j') || flags.has('--json');

try {
  if (flags.has('--rate-limit')) {
    const limits = await getRateLimit();
    console.log('GitHub API Rate Limits:');
    console.log(`  Core:   ${limits.core.remaining}/${limits.core.limit} (resets ${limits.core.reset.toLocaleTimeString()})`);
    console.log(`  Search: ${limits.search.remaining}/${limits.search.limit} (resets ${limits.search.reset.toLocaleTimeString()})`);
    process.exit(0);
  }

  const { repos, total } = await searchRepos({ daysBack, perPage: count, language });
  const analysis = analyze(repos);

  const opts = { daysBack, language };
  if (json) {
    console.log(formatJson(analysis));
  } else if (markdown) {
    console.log(formatMarkdown(analysis, opts));
  } else {
    console.log(formatText(analysis, opts));
  }
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
