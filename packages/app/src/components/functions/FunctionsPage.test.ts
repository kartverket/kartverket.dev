/**
 * @jest-environment node
 */
import { EntityData } from './types';
import { hasDescendantOwnedByAny } from './hasDescendantOwnedByAny';

describe('hasDescendantOwnedByAny', () => {
  const makeEntity = (name: string, owner: string): EntityData => ({
    kind: 'Function',
    namespace: 'default',
    title: name,
    name,
    ref: `function:default/${name}`,
    owner,
  });

  it('returns true when a direct child is owned by the team', () => {
    const funcMap = new Map<string | undefined, EntityData[]>([
      ['function:default/root', [makeEntity('child', 'group:default/myteam')]],
    ]);
    expect(
      hasDescendantOwnedByAny('function:default/root', funcMap, ['myteam']),
    ).toBe(true);
  });

  it('returns false when no descendants match', () => {
    const funcMap = new Map<string | undefined, EntityData[]>([
      [
        'function:default/root',
        [makeEntity('child', 'group:default/otherteam')],
      ],
    ]);
    expect(
      hasDescendantOwnedByAny('function:default/root', funcMap, ['myteam']),
    ).toBe(false);
  });

  it('does not infinite-loop on circular parent-relations', () => {
    // A → B → A (cycle)
    const a = makeEntity('a', 'group:default/otherteam');
    const b = makeEntity('b', 'group:default/otherteam');
    const funcMap = new Map<string | undefined, EntityData[]>([
      [a.ref, [b]],
      [b.ref, [a]],
    ]);

    // Should terminate and return false (no matching owner)
    expect(hasDescendantOwnedByAny(a.ref!, funcMap, ['myteam'])).toBe(false);
  });

  it('finds a match through a cycle without infinite-looping', () => {
    // A → B → C → A (cycle), C is owned by myteam
    const a = makeEntity('a', 'group:default/other');
    const b = makeEntity('b', 'group:default/other');
    const c = makeEntity('c', 'group:default/myteam');
    const funcMap = new Map<string | undefined, EntityData[]>([
      [a.ref, [b]],
      [b.ref, [c]],
      [c.ref, [a]],
    ]);

    expect(hasDescendantOwnedByAny(a.ref!, funcMap, ['myteam'])).toBe(true);
  });
});
