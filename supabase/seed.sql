-- Données d'EXEMPLE pour voir l'application remplie dès le premier lancement.
-- Auteurs et livres fictifs : supprimez-les depuis /admin/auteurs quand vous
-- ajoutez les vrais. À exécuter après schema.sql, dans l'éditeur SQL Supabase.
-- Peut être relancé sans créer de doublons.

insert into public.authors (slug, name, tagline, bio, is_local)
values
  (
    'david-elian',
    'David Elian',
    'Romancier · Thriller',
    'Fiche d''exemple. David écrit des Thrillers qui se déroulent à Vichy. Remplacez ce texte par la vraie biographie de l''auteur.',
    true
  ),
  (
    'paul-mercier-exemple',
    'Paul Mercier (exemple)',
    'Auteur jeunesse · Illustrateur',
    'Fiche d''exemple. Paul écrit et illustre des albums pour les 3-8 ans.',
    false
  )
on conflict (slug) do nothing;

insert into public.books (author_id, slug, title, summary, genre, publisher, price, is_available, is_signed)
select a.id, b.slug, b.title, b.summary, b.genre, b.publisher, b.price, true, b.is_signed
from public.authors a
join (
  values
    ('david-elian', 'eaux-troubles', 'Eaux troubles', 'Un corps retrouvé au bord de l''Allier, une ville thermale qui garde ses secrets… Résumé d''exemple.', 'Polar / Thriller', 'Éditions Exemple', 19.90, true),
    ('david-elian', 'la-source-noire', 'La Source noire', 'Deuxième enquête du commandant Morel. Résumé d''exemple.', 'Polar / Thriller', 'Éditions Exemple', 21.00, false),
    ('paul-mercier-exemple', 'le-petit-ours-de-vichy-exemple', 'Le petit ours de Vichy', 'Un album tendre pour découvrir la ville. Résumé d''exemple.', 'Jeunesse', 'Éditions Exemple', 13.50, false)
) as b(author_slug, slug, title, summary, genre, publisher, price, is_signed)
  on a.slug = b.author_slug
on conflict (slug) do nothing;

insert into public.signings (author_id, book_id, title, starts_at, ends_at)
select a.id, bk.id, 'Séance de dédicace',
  date_trunc('day', now()) + interval '10 days' + interval '13 hours',
  date_trunc('day', now()) + interval '10 days' + interval '17 hours'
from public.authors a
join public.books bk on bk.slug = 'eaux-troubles'
where a.slug = 'david-elian'
  and not exists (select 1 from public.signings s where s.author_id = a.id);

insert into public.signings (author_id, book_id, title, starts_at, ends_at)
select a.id, bk.id, 'Lecture et dédicace pour les enfants',
  date_trunc('day', now()) + interval '24 days' + interval '9 hours',
  date_trunc('day', now()) + interval '24 days' + interval '12 hours'
from public.authors a
join public.books bk on bk.slug = 'le-petit-ours-de-vichy-exemple'
where a.slug = 'paul-mercier-exemple'
  and not exists (select 1 from public.signings s where s.author_id = a.id);
