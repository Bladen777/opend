export const idlFactory = ({ IDL }) => {
  const Currency = IDL.Record({ 'name' : IDL.Text, 'symbol' : IDL.Text });
  return IDL.Service({
    'complete_purchase' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal],
        [IDL.Text],
        [],
      ),
    'get_currency_info' : IDL.Func([], [Currency], ['query']),
    'get_listed_NFTs' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'get_listed_price' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'get_opend_canister_id' : IDL.Func([], [IDL.Principal], ['query']),
    'get_original_owner' : IDL.Func(
        [IDL.Principal],
        [IDL.Principal],
        ['query'],
      ),
    'get_owned_NFTs' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'is_listed' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'list_item' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'mint' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
