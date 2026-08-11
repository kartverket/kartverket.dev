# Synthetic local catalog

These fixtures contain invented entities for credential-free local
development. They must not contain production names, identifiers, email
addresses, memberships, or ownership data.

The source descriptors intentionally omit catalog-generated fields:

- `metadata.uid` and `metadata.etag` are assigned by the catalog;
- `backstage.io/managed-by-location` and
  `backstage.io/managed-by-origin-location` are assigned from the active local
  catalog location; and
- `relations` are generated from fields such as `spec.parent`,
  `spec.children`, `spec.memberOf`, and `spec.owner`.

As a result, entities returned by the catalog API have the same structural
shape as provider-managed entities while the checked-in fixtures remain valid
Backstage source YAML.
