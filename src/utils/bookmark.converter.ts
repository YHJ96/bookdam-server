import { Bookmark, Tags, Tag } from '@prisma/client';

type BookmarksSource = Array<BookmarkSource>;
type BookmarkSource = Bookmark & { tags: Array<Tags & { tag: Tag }> };

export const bookmarksConverter = (source: BookmarksSource) => {
  return source.map((bookmark) => bookmarkConverter(bookmark));
};

export const bookmarkConverter = (source: BookmarkSource) => {
  const { tags, ...rest } = source;
  const names = tags.map((tags) => tags.tag.name);

  return { ...rest, tags: names };
};
