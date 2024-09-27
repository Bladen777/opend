import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";
import NFT_actor_class "../NFT/nft";




actor OpenD{

    // Define Currency Type
    public type Currency = {
        name: Text;
        symbol: Text; 
    };
    // Define Listing Type
    private type Listing = {
        item_owner: Principal;
        item_price: Nat;
    };
    // Define HashMap for tracking NFTs Minted
    var map_NFTs = HashMap.HashMap
        <Principal, NFT_actor_class.NFT>(
            1, Principal.equal, Principal.hash
        );
    //Define HashMap for tracking the owners of the NFTs
    var map_owners = HashMap.HashMap
        <Principal, List.List<Principal>>(
            1, Principal.equal, Principal.hash
        ); 
    //Define HashMap for tracking the Listed NFTs
    var map_listings = HashMap.HashMap
        <Principal, Listing>(
            1, Principal.equal, Principal.hash
        );
    // Define the Currency names
    let currency : Currency = {
        name = "Freedom";
        symbol = "FREED";
    };

    // Query Function for retrieving the currency info
    public query func get_currency_info() : async Currency{
        return currency;
    };  

    // Shared public function to mint a new NFT
    public shared(msg) func mint(imgData : [Nat8], name: Text) :async Principal{
        let owner : Principal = msg.caller;

        // Adds cycles to the system to ensure the NFT can be minted
            // this would not work if the site was online
        // *** UPDATE IF GOING ONLINE *** 
        Debug.print(debug_show (Cycles.balance()));
        Cycles.add<system>(100_500_000_000);

        // creates a new Canister for the NFT and returns the data
        let new_NFT = await NFT_actor_class.NFT(name, owner, imgData );
    
        // use the NFT data to retrieve the principal id of the new canister
        let new_NFT_principal = await new_NFT.get_canister_id();

        // add the new NFT to the HashMap of NFTs
        map_NFTs.put(new_NFT_principal,new_NFT);
        // call the "add_map_owners" function to add the owner to the owners HashMap
        add_map_owners(owner,new_NFT_principal);
        // return the new NFTs Principal 
        return new_NFT_principal;
    };

    // Private function to check if the owner is in the Owners Hashmap, and add them if they are not
    private func add_map_owners(owner: Principal, nft_id: Principal){
        var owned_nfts : List.List<Principal> = switch (map_owners.get(owner)){
            case null 
                List.nil<Principal>();

            case (?result)
                result;
          };
        
        owned_nfts := List.push(nft_id, owned_nfts);
        Debug.print(debug_show ("OWNED NFTS: ", owned_nfts));
        map_owners.put(owner, owned_nfts);
    };

    // Public query function to return a array of all of the NFT's owned by a specified user
    public query func get_owned_NFTs(user:Principal) :async [Principal]{

        var owned_nfts : List.List<Principal> = switch (map_owners.get(user)){
            case null
                List.nil<Principal>();
            case (?result)
                result;
        };

        let owned_nfts_array = List.toArray<Principal>(owned_nfts);

        return owned_nfts_array;

    };

    // Public query function to return a array of all the Listed NFTs
    public query func get_listed_NFTs() :async [Principal]{
        
        let ids = Iter.toArray(map_listings.keys());

        return ids;

    };

    // Public query function to return the original owner of a listed NFT
    public query func get_original_owner(id:Principal) :async Principal{
        var listing : Listing = switch (map_listings.get(id)){
            case null
                return Principal.fromText("");
            case(?result) 
                result;
            };
        return listing.item_owner;
    };

    // Public query function to return the price of a listed NFT
    public query func get_listed_price(id: Principal) : async Nat{
        var listing : Listing = switch (map_listings.get(id)){
            case null
                return 0;
            case (?result)
                result;
        };
        return listing.item_price;
    };

    // Function to put a NFT up for sale
    public shared(msg) func list_item(id: Principal, price: Nat) : async Text {
        // Checks if the NFT exists in the HashMap if NFTs, returns the NFT Canister
        var item : NFT_actor_class.NFT = switch (map_NFTs.get(id)){
            case null
                return "NFT does not exist";
            case (?result)
                result;
        };
        
        // Call the NFT Canister and get the owner 
        let owner = await  item.get_owner();
        // Call the "is_listed" function to check if the NFT has been listed yet
        let listed = await is_listed(id);

        // If the NFT has not been listed proceeds to list the NFT
        if (listed == false){
            // Checks if the function caller is the owner of the NFT
            if (Principal.equal(owner, msg.caller)){
                // Adds the NFT to the Listing HashMap, along with its price
                let new_listing : Listing = {
                    item_owner = owner;
                    item_price = price;
                };
                map_listings.put(id, new_listing);
                return "success";
            } else {
                return "You are not the owner"
            }
        }else{
                return "NFT is already Listed";
        
        };
    };
    
    // Function to get the Pricipal from this Canister
    public query func get_opend_canister_id() : async Principal{
        return Principal.fromActor(OpenD);
    };

    // Function to check if a specified NFT has been listed yet
    public query func is_listed(id: Principal) : async Bool{
        if(map_listings.get(id) == null){
            return false;
        } else {
            return true;
        };
    };

    // Function to Purchase NFTs
    public shared(msg) func complete_purchase(nft_id:Principal, owner_id: Principal, new_owner_id: Principal) : async Text {
        
        var purchased_nft :NFT_actor_class.NFT = switch(map_NFTs.get(nft_id)){
            case null
                return "NFT does not exist";
            case (?result)
                result;
        };
        
        let transfer_result = await purchased_nft.transfer_ownership(new_owner_id);
        if (transfer_result == "Sucessfully Transfered"){
            map_listings.delete(nft_id);
            var owned_nfts : List.List<Principal> = switch (map_owners.get(owner_id)){
                case null
                     List.nil<Principal>();
                case (?result)
                    result;
            };

            owned_nfts := List.filter(owned_nfts, func (list_item_id : Principal) :Bool{
                return list_item_id != nft_id;
            });
            add_map_owners(new_owner_id, nft_id);
             return "Success";
        } else {
            return transfer_result;
        };


       
    };


};
