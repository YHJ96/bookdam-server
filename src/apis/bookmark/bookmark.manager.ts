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

export const extractOgImage = (image: OgImage) => {
  if (image === undefined) return undefined;
  if (image.length === 0) return undefined;
  if (image[0].url === undefined) return undefined;

  return image[0].url;
};

export const mergeBookmark = (bookmark: CreateBookmarkDTO, og: OgResult) => {
  const result = {
    title: og.title ?? '',
    description: og.description ?? '',
    url: og.url ?? '',
    image: og.image ?? process.env.EMPTY_IMAGE,
  };

  if (bookmark.title !== '') result.title = bookmark.title;
  if (bookmark.description !== '') result.description = result.description;

  return result;
};

export const processImagesUrl = (imagesUrl?: OgImage) => {
  return imagesUrl?.map((image) => {
    if (image.url.includes('https://')) return image;
    if (image.url.includes('http://')) return image;
    if (image.url.includes('//'))
      return { ...image, url: `https:${image.url}` };
    return { ...image, url: undefined };
  });
};
