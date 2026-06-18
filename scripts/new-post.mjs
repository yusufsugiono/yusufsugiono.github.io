import { createInterface } from 'node:readline';
import { stdin as input, stdout as output, argv } from 'node:process';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function getAnswers() {
  const questions = [
    { key: 'title', prompt: 'Title: ', required: true },
    { key: 'description', prompt: 'Description: ' },
    { key: 'category', prompt: 'Category (default: Umum): ', default: 'Umum' },
    { key: 'draft', prompt: 'Draft? (Y/n): ', default: 'Y' },
    { key: 'tags', prompt: 'Tags (comma-separated): ' },
  ];

  if (input.isTTY) {
    const rl = createInterface({ input, output });
    const answers = {};
    for (const q of questions) {
      const answer = await new Promise((resolve) => {
        rl.question(q.prompt, (a) => resolve(a.trim()));
      });
      const val = answer || q.default || '';
      if (q.required && !val) {
        console.error(`${q.key} is required.`);
        rl.close();
        process.exit(1);
      }
      answers[q.key] = val;
    }
    rl.close();
    return answers;
  }

  const rl = createInterface({ input });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }

  const answers = {};
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const val = lines[i] || q.default || '';
    if (q.required && !val) {
      console.error(`${q.key} is required.`);
      process.exit(1);
    }
    answers[q.key] = val;
  }
  return answers;
}

async function main() {
  console.log('\n=== New Blog Post ===\n');

  const answers = await getAnswers();
  const title = answers.title;
  const description = answers.description;
  const category = answers.category;
  const draft = answers.draft.toLowerCase() !== 'n';
  const tags = answers.tags
    ? answers.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const slug = toSlug(title);
  const pubDate = todayISO();
  const contentDir = join(__dirname, '..', 'src', 'content', 'blog');
  const filePath = join(contentDir, `${slug}.md`);

  if (existsSync(filePath) && input.isTTY) {
    const rl = createInterface({ input, output });
    const overwrite = await new Promise((resolve) => {
      rl.question(`\n"${slug}.md" already exists. Overwrite? (y/N): `, (a) => resolve(a.trim()));
    });
    rl.close();
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Aborted.');
      process.exit(0);
    }
  }

  const tagsYaml = tags.length
    ? `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`
    : 'tags: []';

  const frontmatter = `---
title: "${title}"
description: "${description}"
pubDate: "${pubDate}"
image: "/images/blog/featured-image.jpg"
imageAlt: "Featured image for ${title}"
category: "${category}"
draft: ${draft}
${tagsYaml}
---

Tulis konten blog di sini...
`;

  if (!existsSync(contentDir)) {
    await mkdir(contentDir, { recursive: true });
  }

  await writeFile(filePath, frontmatter, 'utf-8');

  console.log(`\nDone! File created: src/content/blog/${slug}.md`);
}

main();
