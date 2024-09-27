import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

actor class NFT (name: Text, owner: Principal, content: [Nat8]) = this{

    private let item_name = name;
    private var nft_owner = owner;
    private let image_bytes = content;

    public query func get_name() : async Text{
        Debug.print(debug_show ("name is got: ", item_name));
        return item_name;
    };

    public query func get_owner() : async Principal{
        Debug.print(debug_show ("owner is got: ", nft_owner));
        return nft_owner;
    };

    public query func get_asset() : async [Nat8]{
        Debug.print(debug_show ("img is got!!! "));
        return image_bytes;
    };


    public query func get_canister_id() :async Principal{
        return Principal.fromActor(this);
    };

    public shared(msg) func transfer_ownership(new_owner: Principal) : async Text {
        if (msg.caller == nft_owner){
            nft_owner := new_owner;
            return "Sucessfully Transfered"
        } else {
            return "Error: not initiated by the owner"
        }

    }

};