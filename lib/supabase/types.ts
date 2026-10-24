export type Author = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  bio: string | null;
  photo_url: string | null;
  is_local: boolean;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  created_at: string;
};

export type AuthorRef = Pick<Author, "slug" | "name">;

export type Book = {
  id: string;
  author_id: string;
  slug: string;
  title: string;
  summary: string | null;
  genre: string | null;
  publisher: string | null;
  isbn: string | null;
  release_date: string | null;
  price: number | null;
  cover_url: string | null;
  is_available: boolean;
  is_signed: boolean;
  created_at: string;
};

export type BookWithAuthor = Book & {
  author: AuthorRef;
};

export type Signing = {
  id: string;
  author_id: string;
  book_id: string | null;
  title: string | null;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
};

export type SigningWithDetails = Signing & {
  author: Pick<Author, "slug" | "name" | "photo_url">;
  book: Pick<Book, "slug" | "title" | "cover_url"> | null;
};

export const SIGNING_SELECT =
  "*, author:authors(slug, name, photo_url), book:books(slug, title, cover_url)";

export type Announcement = {
  id: string;
  author_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  expires_at: string | null;
  created_at: string;
};

export type AnnouncementWithAuthor = Announcement & {
  author: AuthorRef | null;
};
