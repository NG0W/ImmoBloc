type token_id is nat

// nat(=token id) --> address(=user) --> nat(=balance)
type balance is big_map(token_id, map(address, nat))

// nat(=token id) --> string(=link to ipfs)
type uris is big_map(token_id, string)

// address(=operator) -->  address(=operated) --> nat(=id nft) --> bool(=allow/deny)
type operator_approvals is big_map(address, map(address, map(nat, bool)))

type storage is record [
    balance: balance;
    operator_approvals: operator_approvals;
    uris: uris;
    counter: nat;
]

type balance_of_param is record [
    addr: address;
    token_id: token_id;
]

const noOperations : list (operation) = nil;
type return is list(operation) * storage;


(* view 'view1', simply returns the storage *)
[@view] function getStorage (const _ : unit; const s: storage) : storage is s

function mint(const _ : unit; const s: storage) : return is 
block {
    // On s'assure qu'il n'y ait pas un probleme au niveau de l'avancer de l'ID
    if Big_map.mem(s.counter, s.balance) 
    then failwith("ID already used")
    else skip;

    // var balances := case Big_map.find_opt(s.counter, s.balance) of [
    // | Some (bal) -> bal
    // | None -> skip
    // ];

    // On créer un mapping qui représente le NFT et son propriétaire
    const nft : map(address, nat) = map [
        Tezos.sender -> 1n
    ];

    // On l'ajoute au mapping balance
    const _newBalance : balance = Big_map.update(s.counter, nft, s.balance);
} with (noOperations, s)
//type nat, map (address , nat), big_map (nat ,map (address ,nat)). 

function burn(const id : token_id; const s: storage) : return is 
block {

    var balances : map(address, nat) := case Big_map.find_opt(id, s.balance) of [
    | Some (bal) -> bal
    | None -> failwith("You're trying to be burn an unexisting NFT")
    ];

     var user_balance : nat := case Map.find_opt(id, balances) of [
    | Some (bal) -> bal
    | None -> failwith("You don't own the NFT")
    ]; 

    var updated_balance_map := if user_balance = 1n then Map.update(Tezos.sender, 0, balances) else failwith("Don't burn an unexisting token");
    s.balance[id] := updated_balance_map;
    //var updated_balance_bigmap := Big_map(id, updated_balance_map, s.storage[id])
    
} with (noOperations, s)


type action is 
  | Mint of unit
  | Burn of token_id

  function main(const action : action; const s : storage) : return is
  case action of [
    | Mint     -> mint(unit, s)
    | Burn(id) -> burn(id, s)
  ]
(* view 'view1', simply returns the storage *)
// [@view] function balanceOf (const params : balance_of_param; const s: storage) : storage is 
// block {
//     if Big_map.mem(params.token_id, s.balance) then
//         if Big_map.

//     else then failwith("Token id not found")
// }
// var esc : escrow := case s.escrows[id] of
//         Some(_escrow) -> _escrow
//         | None -> failwith(doesnt_exist)
//     end;