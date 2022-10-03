# Use array instead of record

## Proposal A: Use Record
```typescript
const tests = {
  'add returns addition of two numbers': test({
    expectTask: add(1, 2),
    toEqual: add(1, 2),
  })
}
```

## Proposal B: Use Array
```typescript
const tests = [ 
  test('add returns addition of two numbers', {
    expectTask: add(1, 2),
    toEqual: add(1, 2),
  })
]
```

## Accepted: Proposal B
Reason: 
- In proposal A, tests may lost when merged with another tests.
  Only smart people will notice this.
```typescript
const testsA = {
  foo : test({
    expectTask: add(1, 2),
    toEqual: 3,
  })
}

const testsB = {
  foo : test({
    expectTask: add(1, 2),
    toEqual: 3,
  })
}

// Test `foo` from `testsA` is lost
const allTests = { ...testsA, ...testsB };
```

# No `describe` for scoping

## Proposal A: Use `describe` for scoping
```typescript
const tests = describe('add function', [ 
  test('returns addition of two numbers', {
    expectTask: add(1, 2),
    toEqual: 3,
  })
  test('returns addition of three numbers', {
    expectTask: add(1, 2, 3),
    toEqual: 6,
  })
])
```

## Proposal B: Rewrite the description for every tests
```typescript
const tests = [ 
  test('add function returns addition of two numbers', {
    expectTask: add(1, 2),
    toEqual: 3,
  })
  test('add function returns addition of three numbers', {
    expectTask: add(1, 2, 3),
    toEqual: 6,
  })
]
```

## Accepted: Proposal B
Reason: 
- Only smart people can scope the tests properly. 
  Even fewer people when it comes to nested scoping.
- When the number of tests in the scope increases, 
  it will be hard to read the name of the test.
