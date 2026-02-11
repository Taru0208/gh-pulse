import https from 'https';

const API_BASE = 'https://api.github.com';
const USER_AGENT = 'gh-pulse/0.1.0';

function request(url) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': USER_AGENT,
      'Accept': 'application/vnd.github+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const req = https.get(url, {
      headers,
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`GitHub API returned ${res.statusCode}: ${data.slice(0, 200)}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
  });
}

function dateStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

/**
 * Search for repos created in a date range, sorted by stars.
 */
export async function searchRepos({ daysBack = 7, perPage = 30, language = null } = {}) {
  const since = dateStr(daysBack);
  let q = `created:>${since}`;
  if (language) q += ` language:${language}`;

  const url = `${API_BASE}/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${perPage}`;
  const data = await request(url);

  return {
    total: data.total_count,
    repos: data.items.map(r => ({
      name: r.full_name,
      url: r.html_url,
      description: r.description || '',
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      topics: r.topics || [],
      created: r.created_at,
      license: r.license?.spdx_id || null,
    })),
  };
}

/**
 * Get the rate limit status.
 */
export async function getRateLimit() {
  const data = await request(`${API_BASE}/rate_limit`);
  const core = data.resources.core;
  const search = data.resources.search;
  return {
    core: { remaining: core.remaining, limit: core.limit, reset: new Date(core.reset * 1000) },
    search: { remaining: search.remaining, limit: search.limit, reset: new Date(search.reset * 1000) },
  };
}
