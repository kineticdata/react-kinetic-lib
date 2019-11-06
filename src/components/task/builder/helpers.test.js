import { List } from 'immutable';
import { findNodeDependencies } from './helpers';
import { NodeResultDependency } from './models';

describe('findNodeDependencies', () => {
  test('supports erb', () => {
    expect(
      findNodeDependencies(
        ['node', '2', 'parameter', '4'],
        'Hello <%= @results ["Person"]["First Name"] %> from <%= @results["Requester"]["Name"] %>',
        true,
      ),
    ).toEqual(
      List([
        NodeResultDependency({
          context: List(['node', '2', 'parameter', '4']),
          name: 'Person',
          index: 21,
        }),
        NodeResultDependency({
          context: List(['node', '2', 'parameter', '4']),
          name: 'Requester',
          index: 66,
        }),
      ]),
    );
  });

  test('supports ruby', () => {
    expect(
      findNodeDependencies(
        ['connector', '1'],
        '"Hello " + @results["Person"]["First Name"]',
      ),
    ).toEqual(
      List.of(
        NodeResultDependency({
          context: List(['connector', '1']),
          name: 'Person',
          index: 21,
        }),
      ),
    );
  });

  test('supports %^...^ strings', () => {
    expect(
      findNodeDependencies(
        ['connector', '1'],
        '"Hello " + @results[%^Person^]["First Name"]',
      ),
    ).toEqual(
      List.of(
        NodeResultDependency({
          context: List(['connector', '1']),
          name: 'Person',
          index: 22,
        }),
      ),
    );
  });

  test('supports %q^...^ strings', () => {
    expect(
      findNodeDependencies(
        ['connector', '1'],
        '"Hello " + @results[%q^Person^]["First Name"]',
      ),
    ).toEqual(
      List.of(
        NodeResultDependency({
          context: List(['connector', '1']),
          name: 'Person',
          index: 23,
        }),
      ),
    );
  });

  test('supports %(...) strings', () => {
    expect(
      findNodeDependencies(
        ['connector', '1'],
        '"Hello " + @results[%(Person)]["First Name"]',
      ),
    ).toEqual(
      List.of(
        NodeResultDependency({
          context: List(['connector', '1']),
          name: 'Person',
          index: 22,
        }),
      ),
    );
  });

  test('allows whitespace between @results and [ and string', () => {
    expect(
      findNodeDependencies(
        ['connector', '1'],
        '"Hello " + @results [ "Person" ]["First Name"]',
      ),
    ).toEqual(
      List.of(
        NodeResultDependency({
          context: List(['connector', '1']),
          name: 'Person',
          index: 23,
        }),
      ),
    );
  });

  test('returns empty is no node dependencies', () => {
    expect(
      findNodeDependencies(
        ['connector', '1'],
        '"Hello " + @other["Person"]["First Name"]',
      ),
    ).toEqual(List());
  });
});
