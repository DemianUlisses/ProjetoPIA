CREATE EXTENSION unaccent;

CREATE OR REPLACE FUNCTION public.immutable_unaccent(regdictionary, text)
  RETURNS text LANGUAGE c IMMUTABLE PARALLEL SAFE STRICT AS
'$libdir/unaccent', 'unaccent_dict';

CREATE OR REPLACE FUNCTION public.f_unaccent(text)
  RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT AS
$func$
SELECT public.immutable_unaccent(regdictionary 'public.unaccent', $1)
$func$;

update rotina set searchable = upper(public.f_unaccent(descricao)) || cast(id as varchar(10));
update usuario set searchable = upper(public.f_unaccent(coalesce(email, ''))) || upper(public.f_unaccent(coalesce(nome, '')));