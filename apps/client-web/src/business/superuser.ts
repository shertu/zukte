const superusers: string[] = ['112088567581740211952'];

/**
 * Does the specified id belong to a superuser?
 */
export function isSuperuser(id: string): boolean {
  return !!superusers.find(sid => sid === id);
}
