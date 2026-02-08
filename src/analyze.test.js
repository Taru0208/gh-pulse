import { describe, it } from 'node:test';
import assert from 'node:assert';
import { analyze } from './analyze.js';

const mockRepos = [
  { name: 'a/foo', stars: 100, language: 'Python', topics: ['ai', 'ml'], license: 'MIT', description: 'test', forks: 5 },
  { name: 'b/bar', stars: 50, language: 'Python', topics: ['ai', 'data'], license: 'Apache-2.0', description: 'test2', forks: 2 },
  { name: 'c/baz', stars: 200, language: 'JavaScript', topics: ['web'], license: null, description: 'test3', forks: 10 },
  { name: 'd/qux', stars: 30, language: 'Go', topics: ['cli', 'ai'], license: 'MIT', description: 'test4', forks: 1 },
];

describe('analyze', () => {
  it('should count languages correctly', () => {
    const result = analyze(mockRepos);
    assert.strictEqual(result.languages['Python'], 2);
    assert.strictEqual(result.languages['JavaScript'], 1);
    assert.strictEqual(result.languages['Go'], 1);
  });

  it('should count topics correctly', () => {
    const result = analyze(mockRepos);
    assert.strictEqual(result.topics['ai'], 3);
    assert.strictEqual(result.topics['ml'], 1);
    assert.strictEqual(result.topics['web'], 1);
  });

  it('should compute star stats', () => {
    const result = analyze(mockRepos);
    assert.strictEqual(result.stats.maxStars, 200);
    assert.strictEqual(result.stats.totalStars, 380);
    assert.strictEqual(result.stats.avgStars, 95);
    assert.strictEqual(result.stats.count, 4);
  });

  it('should sort top repos by stars', () => {
    const result = analyze(mockRepos);
    assert.strictEqual(result.topRepos[0].name, 'c/baz');
    assert.strictEqual(result.topRepos[1].name, 'a/foo');
  });

  it('should handle empty input', () => {
    const result = analyze([]);
    assert.deepStrictEqual(result.languages, {});
    assert.deepStrictEqual(result.topics, {});
  });

  it('should generate summary text', () => {
    const result = analyze(mockRepos);
    assert.ok(result.summary.includes('4 trending repos'));
    assert.ok(result.summary.includes('Python'));
  });
});
