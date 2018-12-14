import {
  add,
  all,
  always,
  and,
  append,
  concat,
  cons,
  dec,
  filter,
  find,
  findBy,
  findOf,
  first,
  flip,
  get,
  greaterThan,
  has,
  identity,
  inc,
  includes,
  includesi,
  into,
  lessThan,
  map,
  matching,
  maxBy,
  maxOf,
  minBy,
  minOf,
  not,
  or,
  prepend,
  productOf,
  push,
  rest,
  returns,
  some,
  sub,
  sumOf,
  toggle
} from "shades";

interface Settings {
  permissions: "visible" | "private";
  lastLogin: Date;
}
interface Post {
  title: string;
  description: string;
  likes: number;
}

interface User {
  name: string;
  posts: Post[];
  goldMember: boolean;
  friends: User[];
  settings: Settings;
}

declare const users: User[];
declare const user: User;
declare const byName: { [name: string]: User };

into("a")({ a: 10 }); // $ExpectType number
into("b")({ a: 10 }); // $ExpectError
into({ a: 10 })({ a: 10 }); // $ExpectType boolean
into({ a: 10 })({ b: 10 }); // $ExpectError
into((x: number) => x + 1)(10); // $ExpectType number

filter((user: User) => user.friends.length > 0)(users); // $ExpectType User[]
filter((user: User) => user.name)(byName); // $ExpectType { [key: string]: User; }
filter("name")(users); // $ExpectType User[]
filter("name")(byName); // $ExpectType { [key: string]: User; }
filter("butts")(users); // $ExpectError
filter({ name: "john" })(users); // $ExpectType User[]
filter({ name: "john" })(byName); // $ExpectType { [key: string]: User; }
filter({
  settings: (settings: string) => settings
})(users); // $ExpectError
filter({
  settings: (settings: Settings) => settings
})(users); // $ExpectType User[]

map("name")(users); // $ExpectType string[]
map("name")(byName); // $ExpectType { [key: string]: string; }
map("not-a-key")(users); // $ExpectType never
map("not-a-key")(byName); // $ExpectType never
const usersFriends = map("friends")(users); // $ExpectType User[][]
map(1)(usersFriends); // $ExpectType User[]
const usersFriendsByName = map("friends")(byName); // $ExpectType { [key: string]: User[]; }
map(2)(usersFriendsByName); // $ExpectType { [key: string]: User; }
map((x: User) => x.name)(users); // $ExpectType string[]
map({ name: "john", settings: (settings: Settings) => !!settings })(users); // $ExpectType boolean[]
map({ name: "john", settings: (settings: Settings) => !!settings })(byName); // $ExpectType { [key: string]: boolean; }

declare const fetchUsers: Promise<User[]>;
// Nested maps require type annotations, but still provide safety
map<User[], string[]>(map("name"))(fetchUsers); // $ExpectType Promise<string[]>
// map<User[], boolean[]>(map('name'))(fetchUsers) // $ExpectError

declare const userMap: Map<string, User>;
declare const userSet: Set<User>;
map("name")(userMap); // $ExpectType Map<string, string>
map("name")(userSet); // $ExpectType Set<string>

find("name")(users); // $ExpectedType User | undefined
find((user: User) => user.friends); // $ExpectedType User | undefined
find((user: User) => user.friends.length > 0)(users); // $ExpectType User | undefined
find({ name: "barg" })(users); // $ExpectType User | undefined
find({ name: false })(users); // $ExpectError
find({ name: (s: string) => !!"barg" })(users); // $ExpectType User | undefined
find({ name: (s: Settings) => !!"barg" })(users); // $ExpectError
const a = find({
  friends: find({ name: "silent bob" })
})(users);
a; // $ExpectType User | undefined
find({ settings: { permissions: false } })(users); // $ExpectError
find({
  settings: { permissions: false }
})(users); // $ExpectError
find({
  settings: { permissions: (perm: string) => !!perm }
})(users); // ExpectType User | undefined
find({
  settings: { permissions: (perm: boolean) => !!perm }
})(users); // $ExpectError

some("name")(users); // $ExpectedType boolean
some((user: User) => user.friends); // $ExpectedType boolean
some((user: User) => user.friends.length > 0)(users); // $ExpectType boolean
some({ name: "barg" })(users); // $ExpectType boolean
some({ name: false })(users); // $ExpectError
some({ name: (s: string) => !!"barg" })(users); // $ExpectType boolean
some({ name: (s: boolean) => !!"barg" })(users); // $ExpectError

cons(1)([1, 2, 3]); // $ExpectType number[]
cons("a")(["a", "b", "c"]); // $ExpectType string[]
cons(1)(2); // $ExpectError
cons(1)(["a", "b", "c"]); // $ExpectError
cons("1")([1, 2, 3]); // $ExpectError

first([1, 3, 4]); // $ExpectType number
first(users); // $ExpectType User
first("hi"); // $ExpectType string
first(true); // $ExpectError

rest([1, 3, 4]); // $ExpectType number[]
rest(users); // $ExpectType User[]
rest("hi"); // $ExpectError
rest(true); // $ExpectError

concat([1, 2, 3])([2, 3]); // $ExpectType number[]
// [2, 3, 1, 2, 3]
concat(["hi"])(["wo"]); // $ExpectType string[]
// ['wo', 'hi']
concat(["hi"])([1, 2, 3]); // $ExpectError

prepend([1, 2, 3])([2, 3]); // $ExpectType number[]
// [1, 2, 3, 2, 3]
prepend(["hi"])(["wo"]); // $ExpectType string[]
// ['hi', 'wo']
prepend(["hi"])([1, 2, 3]); // $ExpectError

identity(10); // $ExpectType 10
identity("butts"); // $ExpectType "butts"

// Cards on the table this one does not type check with polymorphic
// functions very well. Rank-N type inference is hard to you might
// have to help it along
declare function numAndBool(a: number): (b: boolean) => boolean;
flip(numAndBool); // $ExpectType (b: boolean) => (a: number) => boolean
flip<"hi", 7, "hi">(always)(7)("hi"); // $ExpectType "hi"
flip<"hi", 7, 7>(always)(7)("hi"); // $ExpectError

always(10)(map); // $ExpectType number
always("10")(map); // $ExpectType string
always(10); // $ExpectType (b: any) => number

declare function notFn1(a: number): string;
declare function notFn4(a: number, b: string, c: boolean, d: number): string;
not(notFn1); // $ExpectType Fn1<number, boolean>
not(notFn4); // $ExpectType Fn4<number, string, boolean, number, boolean>
not("name")(users[0]); // $ExpectType boolean
not("butt")(users[0]); // $ExpectError

declare function andFn1(a: number): number;
declare function andFn2(a: number, b: string): number;
declare function andFn3(a: number, b: string, c: boolean): number;
declare function andFn3Bad(a: number, b: string, c: boolean): boolean;
and(andFn3, andFn3, andFn3); // $ExpectType Fn3<number, string, boolean, number>
and(andFn1, andFn2, andFn3); // $ExpectType Fn3<number, string, boolean, number>
and(andFn1, andFn2, identity); // $ExpectType Fn2<number, string, number>
and(andFn1); // $ExpectType Fn1<number, number>
and(andFn1, andFn2, andFn3Bad); // $ExpectError

declare function orFn1(a: number): number;
declare function orFn2(a: number, b: string): number;
declare function orFn3(a: number, b: string, c: boolean): number;
declare function orFn3Bad(a: number, b: string, c: boolean): boolean;
or(orFn3, orFn3, orFn3); // $ExpectType Fn3<number, string, boolean, number>
or(orFn1, orFn2, orFn3); // $ExpectType Fn3<number, string, boolean, number>
or(orFn1, orFn2, identity); // $ExpectType Fn2<number, string, number>
or(orFn1); // $ExpectType Fn1<number, number>
or(orFn1, orFn2, orFn3Bad); // $ExpectError

users[0].posts.reduce(maxOf("likes")); // $ExpectType Post
users[0].posts.reduce(maxOf("title")); // $ExpectError
users[0].posts.reduce(maxOf("farts")); // $ExpectError
users.reduce(maxOf(user => user.name.length)); // $ExpectType User
users.reduce(maxOf(user => user.name)); // $ExpectError

users.reduce(findOf("name")); // $ExpectType User
users.reduce(findOf({ name: "butt" })); // $ExpectType User
users.reduce(findOf({ butt: "name" })); // $ExpectError
users.reduce(findOf(user => user.name)); // $ExpectType User
users.reduce(findOf(user => user.butt)); // $ExpectError
users.map(findOf(user => user.butt)); // $ExpectError

users[0].posts.reduce(sumOf("likes"), 0); // $ExpectType number
users[0].posts.reduce(sumOf("title"), 0); // $ExpectError
users[0].posts.reduce(sumOf("farts"), 0); // $ExpectError
users.reduce(sumOf(user => user.name.length), 0); // $ExpectType number
users.reduce(sumOf(user => user.name), 0); // $ExpectError

users[0].posts.reduce(productOf("likes"), 1); // $ExpectType number
users[0].posts.reduce(productOf("title"), 1); // $ExpectError
users[0].posts.reduce(productOf("farts"), 1); // $ExpectError
users.reduce(productOf(user => user.name.length), 1); // $ExpectType number
users.reduce(productOf(user => user.name), 1); // $ExpectError

has({ a: 1 }); // $ExpectType (obj: HasPattern<{ a: number; }>) => boolean
has({ a: false }); // $ExpectType (obj: HasPattern<{ a: boolean; }>) => boolean
has({ a: 1 })({ a: 10 }); // $ExpectType boolean
has({ a: 1 })({ a: false }); // $ExpectError
has({ a: (n: number) => n > 10 })({ a: 5 }); // $ExpectType boolean
has({ a: (n: number) => n > 10 })({ a: false }); // $ExpectError

greaterThan(2); // $ExpectType (b: number) => boolean
greaterThan("a"); // $ExpectType (b: string) => boolean
greaterThan("a")("b"); // $ExpectType boolean
greaterThan("a")(1); // $ExpectError
greaterThan({ a: 1 }); // $ExpectError

lessThan(2); // $ExpectType (b: number) => boolean
lessThan("a"); // $ExpectType (b: string) => boolean
lessThan("a")("b"); // $ExpectType boolean
lessThan("a")(1); // $ExpectError
lessThan({ a: 1 }); // $ExpectError

toggle(false); // $ExpectType boolean
toggle("a"); // $ExpectError

returns(10)(() => 10); // $ExpectType boolean
returns(10)(() => "hi"); // $ExpectError
declare const getID: {
  ID(): string;
};
has({ ID: returns("blah") })(getID); // $ExpectType boolean
has({ ID: returns(10) })(getID); // $ExpectError

add(1)(3); // $ExpectType number
add(1)("s"); // $ExpectError

sub(1)(3); // $ExpectType number
sub(1)("s"); // $ExpectError

inc(1); // $ExpectType number
inc(""); // $ExpectError

dec(1); // $ExpectType number
dec(""); // $ExpectError

includes("hello")("hello"); // $ExpectType boolean
includes("hello")(false); // $ExpectError

includesi("hello")("hello"); // $ExpectType boolean
includesi("hello")(false); // $ExpectError

get("friends", all<User>(), "name")(user); // $ExpectType string[]

get(matching("goldMember"))(users); // $ExpectType User[]
get(matching("goldMember"), "name")(users); // $ExpectType string[]

get("friends", findBy.of<User>({ name: "john" }), "name")(user); // $ExpectType string
get("friends", findBy.of<User>("goldMember"), "posts")(user); // $ExpectType Post[]
get("friends", findBy((user: User) => user.settings), "posts")(user); // $ExpectType Post[]
get("friends", findBy((user: User) => user.settings), "pots")(user); // $ExpectError

get("friends", maxBy.of<User>({ name: "john" }), "name")(user); // $ExpectType string
get("friends", maxBy.of<User>("goldMember"), "posts")(user); // $ExpectType Post[]
get("friends", maxBy((user: User) => user.settings), "posts")(user); // $ExpectType Post[]
get("friends", maxBy((user: User) => user.settings), "pots")(user); // $ExpectError

get("friends", minBy.of<User>({ name: "john" }), "name")(user); // $ExpectType string
get("friends", minBy.of<User>("goldMember"), "posts")(user); // $ExpectType Post[]
get("friends", minBy((user: User) => user.settings), "posts")(user); // $ExpectType Post[]
get("friends", minBy((user: User) => user.settings), "pots")(user); // $ExpectError
