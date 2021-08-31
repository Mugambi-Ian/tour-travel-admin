import React from "react";
import { EditInput } from "../../../../../../assets/components/Input/input";
import "./pricing.css";

export default class ListingPricing extends React.Component {
  render() {
    let {
      CloseButton,
      listing,
      listing: { category, price },
      update,
      ProceedBtn,
    } = this.props;
    return (
      <div className="el-content">
        <CloseButton />
        <h1>Pricing</h1>
        <p>Charges per day</p>
        <div className="el-pricing-list">
          {listing.pricing.map((x, i) => {
            return (
              <div className="price-card">
                <p>{x.category}</p>
                <p>Kes {x.price}.00 /= </p>
                <img
                  className="unselectable"
                  alt="icon"
                  src={
                    require("../../../../../../assets/drawables/ic-delete.png")
                      .default
                  }
                  onClick={async () => {
                    await setTimeout(() => {
                      listing.pricing.splice(i, 1);
                      update({ listing });
                    }, 200);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="el-pricing">
          <EditInput
            value={listing.category}
            onChange={(e) => {
              listing.category = e.target.value;
              update({ category });
            }}
            name="Category"
            placeholder="Adult"
          />
          <EditInput
            value={listing.price}
            onChange={(e) => {
              listing.price = e.target.value;
              listing.price = parseInt(listing.price) || 0;
              update({ price });
            }}
            name="Price"
            placeholder="300"
          />
          <img
            className="unselectable"
            alt="icon"
            src={
              require("../../../../../../assets/drawables/ic-plus.png").default
            }
            onClick={async () =>
              await setTimeout(() => {
                if (listing.price > 0 && listing.category) {
                  listing.price = 0;
                  listing.category = "";
                  listing.pricing.push({ category, price });
                  update({ listing });
                } else this.props.showTimedToast("Values required");
              }, 200)
            }
          />
        </div>

        <ProceedBtn />
      </div>
    );
  }
}
