export const idlFactory = ({ IDL }) => {
  const NFT = IDL.Service({
    'get_asset' : IDL.Func([], [IDL.Vec(IDL.Nat8)], ['query']),
    'get_canister_id' : IDL.Func([], [IDL.Principal], ['query']),
    'get_name' : IDL.Func([], [IDL.Text], ['query']),
    'get_owner' : IDL.Func([], [IDL.Principal], ['query']),
    'transfer_ownership' : IDL.Func([IDL.Principal], [IDL.Text], []),
  });
  return NFT;
};
export const init = ({ IDL }) => {
  return [IDL.Text, IDL.Principal, IDL.Vec(IDL.Nat8)];
};
