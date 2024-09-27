import React from "react";
import { opend_backend } from "../../../declarations/opend_backend";

function PriceLabel(props){



    return(
        <div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">
          <span className="disChip-label">{props.sell_price} {props.currency_symbol}</span>
        </div>
    );

}

export default PriceLabel;