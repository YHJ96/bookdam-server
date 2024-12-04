import type ogs from 'open-graph-scraper';
import type { CreateBookmarkDTO } from './bookmark.dto';

type OgItems = {
  ogTitle: 'title';
  ogDescription: 'description';
  requestUrl: 'url';
};
type OgImage = Awaited<ReturnType<typeof ogs>>['result']['ogImage'];
type Og = Pick<Awaited<ReturnType<typeof ogs>>['result'], keyof OgItems>;
type OgResult = {
  [K in keyof Og as OgItems[K]]: Og[K];
} & { image?: string };

export const extractOGImage = (image: OgImage) => {
  if (image === undefined) return undefined;
  if (image.length === 0) return undefined;
  if (image[0].url === undefined) return undefined;

  return image[0].url;
};

const EMPTY_IMAGE =
  'https://zyhedgwubqhgbbifgwmd.supabase.co/storage/v1/object/sign/image/empty.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZS9lbXB0eS53ZWJwIiwiaWF0IjoxNzMzMjExNTI5LCJleHAiOjE3NjQ3NDc1Mjl9.2aBu-Xc8hUQN5ZWFOeFxCIiDd-ESxSH524Bcjc1M3DU&t=2024-12-03T07%3A38%3A49.188Z';
export const mergeBookmark = (bookmark: CreateBookmarkDTO, og: OgResult) => {
  const result = {
    title: og.title ?? '',
    description: og.description ?? '',
    url: og.url ?? '',
    image: og.image ?? EMPTY_IMAGE,
  };

  if (bookmark.title !== '') result.title = bookmark.title;
  if (bookmark.description !== '') result.description = result.description;

  return result;
};
