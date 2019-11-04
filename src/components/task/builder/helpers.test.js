import { checkForNodeDependencies } from './helpers';

describe('checkForNodeDependencies', () => {
  test('supports erb', () => {
    expect(
      checkForNodeDependencies(
        'Hello <%= @results ["Person"]["First Name"] %> from <%= @results["Requester"]["Name"] %>',
        true,
      ),
    ).toEqual([['Person', 21], ['Requester', 66]]);
  });

  test('supports ruby', () => {
    expect(
      checkForNodeDependencies('"Hello " + @results["Person"]["First Name"]'),
    ).toEqual([['Person', 21]]);
  });

  test('supports %^...^ strings', () => {
    expect(
      checkForNodeDependencies('"Hello " + @results[%^Person^]["First Name"]'),
    ).toEqual([['Person', 22]]);
  });

  test('supports %q^...^ strings', () => {
    expect(
      checkForNodeDependencies('"Hello " + @results[%q^Person^]["First Name"]'),
    ).toEqual([['Person', 23]]);
  });

  test('supports %(...) strings', () => {
    expect(
      checkForNodeDependencies('"Hello " + @results[%(Person)]["First Name"]'),
    ).toEqual([['Person', 22]]);
  });

  test('allows whitespace between @results and [ and string', () => {
    expect(
      checkForNodeDependencies(
        '"Hello " + @results [ "Person" ]["First Name"]',
      ),
    ).toEqual([['Person', 23]]);
  });

  test('returns empty is no node dependencies', () => {
    expect(
      checkForNodeDependencies('"Hello " + @other["Person"]["First Name"]'),
    ).toEqual([]);
  });
});
