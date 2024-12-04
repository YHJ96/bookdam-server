import { Bookmark, Tags, Tag } from '@prisma/client';
import { tagConverter } from './tag.converter';

type BookmarksSource = Array<BookmarkSource>;
type BookmarkSource = Bookmark & { tags: Array<Tags & { tag: Tag }> };

export const bookmarksConverter = (source: BookmarksSource) => {
  return source.map((bookmark) => bookmarkConverter(bookmark));
};

export const bookmarkConverter = (source: BookmarkSource) => {
  const { tags, ...rest } = source;
  const names = tagConverter(tags);

  return { ...rest, tags: names };
};
