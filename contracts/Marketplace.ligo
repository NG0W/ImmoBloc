
type token_id is nat
type database_id is nat

type listed_sale is record [
    price: tez;
    nft_id: token_id;
    to_pay: address;
]

type addFile_params is record [
    data : string;
    token_id : token_id;
    database_id: database_id;
]

type storage is record [
    whitelist: set(address);
    counter: token_id;
    sales: map(token_id, listed_sale);
    files : map(token_id, map(database_id, string));
]

const noOperations : list (operation) = nil;
type return is list(operation) * storage;

function addWhitelist(const operator : address; var s: storage) : return is 
block {
    // On s'assure qu'il n'y ait pas un probleme au niveau de l'avancer de l'ID
     if Tezos.sender = s.owner then skip else failwith("You can't use this function");
     const whitelisted : set(address) = Set.add(operator, s.whitelist);
     s.whitelist := whitelisted

 } with (noOperations, s)

function addFile(const params : addFile_params; var s : storage) : return is 
block {
    if Set.mem (Tezos.sender, whitelist) then skip else failwith("You can't do this");
    // const map_files = case Map.find_opt(addFile_params.token_id, s.files) of [
    //     | Some (files) -> failwith("File already exist")
    //     | None -> skip
    // ];

    const nested_map :map(database_id, string) = map [
        addFile_params.database_id -> addFile_params.data
    ];
    const new_files = Map.add(addFile_params.token_id, nested_map, s.files);
    s.files := new_files;
}with (noOperations, s)

function createSale(const sale : listed_sale; var s : storage) : return is block {
   
    const new_sales = Map.add(s.counter, listed_sale, s.sales)

    const nft_contract := case Tezos.get_entrypoint_opt("%transferFrom", "KT1GWgKAvnrw7aoic2H3wyY5FqX5NC6djLvp") of [
        | Some (contract) -> contract
        | None -> failwith("Can't find entrypoint")
    ];


    s.sale = new_sales;
}with(noOperations, s)

 // Les actions est un type qui permet de créer les entrypoints
type action is 
  | SetWhitelist of address
//   | AddFile of addFile_params
 

// Nos entrypoints
  function main(const action : action; const s : storage) : return is
  case action of [
    | SetWhitelist(addr)     -> addWhitelist(addr, s)
   
  ]
