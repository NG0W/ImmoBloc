type token_id is nat

// nat(=token id) --> address(=user) --> nat(=balance)
type balance is big_map(token_id, map(address, nat))

// nat(=token id) --> string(=link to ipfs)
type uris is big_map(token_id, string)

// address(=holder) -->  address(=operator) --> nat(=id nft) --> bool(=allow/deny)
type operator_approvals is big_map(address, map(address, map(nat, bool)))

type storage is record [
    balance: balance;
    operator_approvals: operator_approvals;
    uris: uris;
    counter: nat;
]

// type balance_of_param is record [
//     addr: address;
//     token_id: token_id;
// ]

type set_approval_params is record[
    addr: address;
    token_id: token_id;
]

type transfer_from_params is record[
    _to: address;
    token_id: nat;
]

const noOperations : list (operation) = nil;
type return is list(operation) * storage;


(* view 'view1', simply returns the storage *)
[@view] function getCounter (const _ : unit; const s: storage) : nat is s.counter

function mint(const _ : unit; var s: storage) : return is 
block {
    // On s'assure qu'il n'y ait pas un probleme au niveau de l'avancer de l'ID
    if Big_map.mem(s.counter, s.balance) 
    then failwith("ID already used")
    else skip;

    // On créer un mapping qui représente le NFT et son propriétaire
     const nft : map(address, nat) = map [
         Tezos.sender -> 1n
     ];

     // On l'ajoute au mapping balance
     s.balance[s.counter] := nft;
     
 } with (noOperations, s)

function burn(const id : token_id; var s: storage) : return is 
block {

    var balances : map(address, nat) := case Big_map.find_opt(id, s.balance) of [
    | Some (bal) -> bal
    | None -> failwith("You're trying to be burn an unexisting NFT")
    ];

     var user_balance : nat := case Map.find_opt(Tezos.sender, balances) of [
    | Some (bal) -> bal
    | None -> failwith("You don't own the NFT")
    ]; 

    var updated_balance_map : map(address, nat) := if user_balance = 1n 
    then Map.update(Tezos.sender, Some(0n), balances) 
    else failwith("Don't burn an unexisting token");

    s.balance[id] := updated_balance_map;
    //var updated_balance_bigmap := Big_map(id, updated_balance_map, s.storage[id])
    
} with (noOperations, s)

// function setApprovalForAll(const params : set_approval_params; var s: storage) : return is 
// block{
//     var balances : map(address, nat) := case Big_map.find_opt(params.token_id, s.balance) of [
//     | Some (bal) -> bal
//     | None -> failwith("This NFT does not exists")
//     ];

//      var user_balance : nat := case Map.find_opt(Tezos.sender, balances) of [
//     | Some (bal) -> bal
//     | None -> failwith("You don't own the NFT")
//     ]; 
// // type operator_approvals is big_map(address, map(address, map(nat, bool)))
//     var updated_balance_map : map(address, nat) := if user_balance = 1n 

    // then var rights : map(address, map(nat, bool)) := case Big_map.find_opt(Tezos.sender, s.balance) of [
    // | Some (rights) -> rights
    // | None -> failwith("There's no rights on this NFT")
    // ];

    // var map_rights := map(nat, bool) := case Big_map.find_opt(params.addr, rights) of [
    //     | Some(right) -> right
    //     | None -> failwith("You do not have rights")
    // ];

    // var get_right := bool := case Big_map.find_opt(params.token_id, map_rights) of [
    //     | Some(right) -> right
    //     | None -> failwith("Cucou")
    // ];

    // if get_right == True then 
    // failwith("You already have the right")
    // else s.operator_approvals[Tezos.sender][params.addr][params.token_id] := True
// } with (noOperations, s)

function transferFrom(const params : transfer_from_params; var s : storage) : return is 
block{
    var balances : map(address, nat) := case Big_map.find_opt(params.token_id, s.balance) of [
    | Some (bal) -> bal
    | None -> failwith("You're trying to be send an unexisting NFT")
    ];

     var user_balance : nat := case Map.find_opt(Tezos.sender, balances) of [
    | Some (bal) -> bal
    | None -> failwith("You don't own the NFT")
    ]; 

    var updated_balance_map : map(address, nat) := if user_balance = 1n 
    then 
    var new_map = Map.update(Tezos.sender, 0, balance_map);
    //Map.update(params._to, 1, balance_map);
    // patch balance_map with map[
        
    //     Tezos.sender -> Some(0n); 
    //     params._to -> Some(1n)];

    s.balance[id] := updated_balance_map;

} with (noOperations, s)

type action is 
  | Mint of unit
  | Burn of token_id

  function main(const action : action; const s : storage) : return is
  case action of [
    | Mint     -> mint(unit, s)
    | Burn(id) -> burn(id, s)
  ]
