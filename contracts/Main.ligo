#include "Methods.ligo"

// La fonction main prend un tuple (Syntaxe : ma_var1 * ma_var2)
// ma_var1 est un variant déterminant quel action va être lancée (c'est un enum de Rust)
// ma var2 c'est le storage
function main(const action : action; const s : storage) : return  is
  case action of
  | SetAdmin(address)      -> setAdmin(address, s)
  | RegisterUser(user)       -> registerUser(user, s)
  end