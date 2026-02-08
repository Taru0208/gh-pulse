/**
 * Analyze a set of repos and extract patterns.
 */
export function analyze(repos) {
  if (repos.length === 0) return { languages: {}, topics: {}, topRepos: [], summary: '' };

  // Language distribution
  const languages = {};
  for (const r of repos) {
    if (r.language) {
      languages[r.language] = (languages[r.language] || 0) + 1;
    }
  }

  // Topic frequency
  const topics = {};
  for (const r of repos) {
    for (const t of r.topics) {
      topics[t] = (topics[t] || 0) + 1;
    }
  }

  // Top repos by stars
  const topRepos = [...repos].sort((a, b) => b.stars - a.stars).slice(0, 10);

  // License distribution
  const licenses = {};
  for (const r of repos) {
    const lic = r.license || 'none';
    licenses[lic] = (licenses[lic] || 0) + 1;
  }

  // Stars statistics
  const stars = repos.map(r => r.stars);
  const totalStars = stars.reduce((a, b) => a + b, 0);
  const avgStars = Math.round(totalStars / stars.length);
  const maxStars = Math.max(...stars);

  // Generate summary
  const topLangs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([l]) => l);

  const topTopics = Object.entries(topics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([t]) => t);

  const summary = [
    `${repos.length} trending repos analyzed.`,
    topLangs.length > 0 ? `Top languages: ${topLangs.join(', ')}.` : '',
    topTopics.length > 0 ? `Hot topics: ${topTopics.join(', ')}.` : '',
    `Stars: avg ${avgStars}, max ${maxStars}.`,
  ].filter(Boolean).join(' ');

  return {
    languages,
    topics,
    licenses,
    topRepos,
    stats: { totalStars, avgStars, maxStars, count: repos.length },
    summary,
  };
}
