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
]

const noOperations : list (operation) = nil;
type return is list(operation) * storage;

type action is 
  | SetAdmin of address
  | RegisterUser of user