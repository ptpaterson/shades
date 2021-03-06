/*
TYPE
:: <S>(...fns: Array<(state: S) => S>): (state: S) => S

DOC
Sequences many updates together:
```ts
> updateAll(
  set('a')(10),
  mod('b')(add(5))
)({b: 20})
{ a: 10, b: 25 }
```

USE
updateAll<User>(
  set('name')('jack'),
  mod('posts', all(), 'title')(s => s.toUpperCase())
)(user) // $ExpectType User

TEST
it('should sequence updates', () => {
  const out =  updateAll(
    set('a')(10),
    mod('b')(add(5))
  )({b: 20})
  out.a.should.equal(10)
  out.b.should.equal(25)
})
*/
export const updateAll = (...updaters) => state =>
  updaters.reduce((currState, transformer) => transformer(currState), state);
