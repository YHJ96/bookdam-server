import { Tag, Tags } from '@prisma/client';

export const tagConverter = (source: Array<Tags & { tag: Tag }>) => {
  return source.map((tags) => tags.tag.name);
};
