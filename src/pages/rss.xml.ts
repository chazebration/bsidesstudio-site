import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const container = await AstroContainer.create();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const body = await container.renderToString(Content);
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.excerpt,
        link: `/blog/${post.id}/`,
        author: post.data.author,
        categories: post.data.tags,
        content: body,
      };
    })
  );

  return rss({
    title: 'B·Sides Studio — Dispatches',
    description: 'A small Portland studio making iOS apps and games. Post-mortems, half-baked theories, things we\'re trying.',
    site: context.site ?? 'https://bsidesstudio.com',
    items,
    customData: `<language>en-us</language>`,
  });
}
