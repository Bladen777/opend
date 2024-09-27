export const idlFactory = ({ IDL }) => {
  const Currency = IDL.Record({ 'name' : IDL.Text, 'symbol' : IDL.Text });
  return IDL.Service({
    'balance_of' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'get_currency_info' : IDL.Func([], [Currency], ['query']),
    'get_current_user' : IDL.Func([], [IDL.Principal], ['query']),
    'get_faucet_amount' : IDL.Func([], [IDL.Nat], ['query']),
    'pay_out' : IDL.Func([], [IDL.Text], []),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'user_principal' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
