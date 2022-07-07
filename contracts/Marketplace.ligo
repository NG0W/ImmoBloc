
type token_id is nat
type database_id is nat



type addFile_params is record [
    data : string;
    token_id : token_id;
    database_id: database_id;
]

type transfer_from_params is record [
    _from: address;
    _to: address;
    token_id: nat;
]

type listed_sale is record [
    price: tez;
    nft_id: token_id;
    to_pay: address;
    transfer_params: transfer_from_params;
]

// type buy_asset_type is record [
//     token_id: token_id;
// ]

type storage is record [
    whitelist: set(address);
    owner: address;
    counter: token_id;
    sales: map(token_id, listed_sale);
    files : map(token_id, map(database_id, string));
]

const noOperations : list (operation) = nil;
type return is list(operation) * storage;
type metadata_params is record [
    token_id: token_id;
    uri: string;
    name: string;
    symbol: string;
    decimals: nat; 
]
type set_approval_params is record [
    operator: address;
    token_id: token_id;
]

type transfer_from_params is record [
    _from: address;
    _to: address;
    token_id: nat;
]

type parameter is 
  | Mint of unit
  | Burn of token_id
  | TransferFrom of transfer_from_params
  | SetApproval of set_approval_params
  | SetTokenMetadata of metadata_params

//const nft_contract_address : string = "KT1PL3926AXfyXZpXE5SqTE9T9u35Mr7CcLx";
function addWhitelist(const operator : address; var s: storage) : return is 
block {
    // On s'assure qu'il n'y ait pas un probleme au niveau de l'avancer de l'ID
     if Tezos.sender = s.owner then skip else failwith("You can't use this function");
     const whitelisted : set(address) = Set.add(operator, s.whitelist);
     s.whitelist := whitelisted

 } with (noOperations, s)

function addFile(const params : addFile_params; var s : storage) : return is 
block {
    if Set.mem (Tezos.sender, s.whitelist) then skip else failwith("You can't do this");
    // const map_files = case Map.find_opt(addFile_params.token_id, s.files) of [
    //     | Some (files) -> failwith("File already exist")
    //     | None -> skip
    // ];

    const nested_map :map(database_id, string) = map [
        params.database_id -> params.data
    ];
    const new_files = Map.add(params.token_id, nested_map, s.files);
    s.files := new_files;
}with (noOperations, s)

function createSale(const sale : listed_sale; var s : storage) : return is block {
   
    const new_sales = Map.add(s.counter, sale, s.sales);
    const contract_addr : address = ("KT19mTC36Mt27bP2UbekgF4seffMoWAQxgdB" : address);

    const nft_contract : contract (parameter) = case (Tezos.get_contract_opt(contract_addr) : option (contract (parameter))) of [
        | Some (contract) -> contract
        | None -> failwith("Can't find contract")
    ];

    const approval_params = record [
        operator = Tezos.self_address;
        token_id = sale.nft_id
    ];

    const operations : list (operation) = list [
        Tezos.transaction(SetApproval(approval_params), 0tez, nft_contract);
        Tezos.transaction(TransferFrom(sale.transfer_params), 0tez, nft_contract);
    ];
    
    s.counter := s.counter + 1n;
    s.sales := new_sales;
}with(operations, s)

// function buyAsset(const sale_id: token_id, var s : storage) : return is block {
//      var sale : listed_sale := case Map.find_opt(sale_id, s.sales) of [
//     | Some (asset) -> asset
//     | None -> failwith("We don't find the sale")
//     ]; 

//     if Tezos.amount = s.price then skip else failwith("Wrong price");

//     const operations : list (operation) = list [
//         Tezos.transaction(, 0tez, nft_contract);
//     ];

// }with(operations, s)

 // Les actions est un type qui permet de créer les entrypoints
type action is 
    | SetWhitelist of address
    | CreateSale of listed_sale
//   | AddFile of addFile_params
 

// Nos entrypoints
  function main(const action : action; const s : storage) : return is
  case action of [
    | SetWhitelist(addr) -> addWhitelist(addr, s)
    | CreateSale(sale)   -> createSale(sale, s)
  ]
