# gh-pulse

A CLI tool that shows what's trending on GitHub. Searches recent repos by stars, analyzes language distribution, popular topics, and license patterns.

## Install

```
npx gh-pulse
```

Or install globally:

```
npm install -g gh-pulse
```

## Usage

```
gh-pulse [options]
```

### Options

| Flag | Description |
|------|-------------|
| `-d, --days N` | Look back N days (default: 7) |
| `-n, --count N` | Number of repos to fetch (default: 30) |
| `-l, --language X` | Filter by language |
| `-m, --markdown` | Output as Markdown |
| `-j, --json` | Output as JSON |
| `--rate-limit` | Show GitHub API rate limit status |
| `-h, --help` | Show help |

### Examples

```bash
# This week's trending repos
gh-pulse

# Last 24 hours
gh-pulse -d 1

# Python repos only
gh-pulse -l python

# 3-day pulse as Markdown
gh-pulse -d 3 -m

# Pipe JSON to jq
gh-pulse -j | jq '.topRepos[].name'

# Check API rate limit
gh-pulse --rate-limit
```

## What it shows

- **Top repos** — sorted by stars, with descriptions and languages
- **Language distribution** — bar chart of trending languages
- **Hot topics** — most common repo topics
- **License breakdown** — what licenses trending projects use
- **Stats** — total/average/max stars

## Output modes

### Text (default)

Terminal-formatted with colors and bar charts.

### Markdown (`-m`)

Structured Markdown with tables — useful for reports or sharing.

### JSON (`-j`)

Full analysis data as JSON — pipe to `jq` or integrate with other tools.

## Authentication

Works without authentication (60 requests/hour). Set `GITHUB_TOKEN` for higher limits (5,000/hour):

```bash
export GITHUB_TOKEN=ghp_...
gh-pulse
```

## Zero dependencies

No runtime dependencies. Pure Node.js (>=18).

## License

MIT
