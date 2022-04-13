#include "Types.ligo"
#include "Error.ligo"

function setAdmin(const admin : address; var s : storage) : return is
block {
    if Tezos.sender = s.admin then s.admin := admin
    else failwith(only_admin);
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

