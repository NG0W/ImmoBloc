type id is nat;

type user is record [
  address: address;
  name: string;
  age: timestamp;
  annualRevenue: nat;
  isEmployed: bool;
]

type storage is record [
  admin: address;
  users: big_map(id, user);
  registeredAddress: set(address);
  counter: id;
  filesHash : map(id, string); // string = hash file
]

type risk_params is record [
  cdi: bool;
  salary: nat;
  age : nat;
]

const only_admin : string = "Only admin can use this function";
const already_exists : string = "This record already exists";
const noOperations : list (operation) = nil;
type return is list(operation) * storage;

function setAdmin(const admin : address; var s : storage) : return is
block {
    if Tezos.sender = s.admin then s.admin := admin else failwith(only_admin);
} with (noOperations, s)

function registerUser(const user : user; var s : storage) : return is
block {
    if Tezos.amount =/= 0tez then failwith("Don't send tez wtf")
    else skip;
    if Big_map.mem(s.counter, s.users) then failwith(already_exists)
    else skip;
    s.users := Big_map.add(s.counter, user, s.users);
    s.registeredAddress := Set.add(user.address, s.registeredAddress);
    s.counter := s.counter + 1n;
    
} with (noOperations, s)


[@view] function calculateRisk(const params : risk_params; const _s : storage)  : nat is
block{
    var notation : nat := 0n; // Out of ten
    if params.cdi = True then notation := notation + 4n else skip;
    if params.salary > 2000n then notation := notation + 3n else skip;
    if params.age < 40n then notation := notation + 3n else skip;

} with(notation)

// function anchorFile(const hash : string; var s : storage) return is
// block{
    
// }

const noOperations : list (operation) = nil;
type return is list(operation) * storage;

type action is 
  | SetAdmin of address
  | RegisterUser of user
  // | CalculateRisk of risk_params

// La fonction main prend un tuple (Syntaxe : ma_var1 * ma_var2)
// ma_var1 est un variant déterminant quel action va être lancée (c'est un enum de Rust)
// ma var2 c'est le storage
function main(const action : action; const s : storage) : return is
  case action of [
    | SetAdmin(addr)      -> setAdmin(addr, s)
    | RegisterUser(user)  -> registerUser(user, s)
    // | CalculateRisk(risks) -> calculateRisk(risks, s)
  ]