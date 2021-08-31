import React from "react";
import "./overview.css";

export default class ListingOverview extends React.Component {
  state = {
    currentScreen: 1,
  };
  render() {
    const { CloseButton, listing, goTo } = this.props;
    const { currentScreen } = this.state;
    return (
      <div className="el-content">
        <CloseButton />
        <h1>{listing.name}</h1>
        <div className="el-overview">
          <div className="lo-nav">
            <img src={listing.listingDp} alt="" />
            <p
              className={currentScreen === 1 ? "on" : ""}
              onClick={async () =>
                await setTimeout(() => {
                  if (currentScreen !== 1) this.setState({ currentScreen: 1 });
                }, 200)
              }
            >
              Overview
            </p>
            <p
              className={currentScreen === 2 ? "on" : ""}
              onClick={async () =>
                await setTimeout(() => {
                  if (currentScreen !== 2) this.setState({ currentScreen: 2 });
                }, 200)
              }
            >
              Pricing
            </p>
          </div>
          <div className="lo-content">
            {currentScreen === 1 ? (
              <div className="overview s1">
                <div className="lo-description">
                  {listing.description.split("\n") ? (
                    listing.description.split("\n").map((x, i) => {
                      return <p>{x}</p>;
                    })
                  ) : (
                    <p>{listing.description}</p>
                  )}
                </div>
                <div className="gallery">
                  {listing.listingPhotos
                    ? listing.listingPhotos.map((x, i) => {
                        return <img src={x} class="gallery__img" alt="" />;
                      })
                    : ""}
                </div>
              </div>
            ) : (
              <div className="overview">
                <p>Charges per day</p>
                <div className="el-pricing-list">
                  {listing.pricing.map((x, i) => {
                    return (
                      <div className="price-card">
                        <p>{x.category}</p>
                        <p>Kes {x.price}.00 /= </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="el-edit-btns">
            <p
              className="el-proceed-btn"
              onClick={async () => {
                await setTimeout(() => {
                  goTo(1);
                }, 200);
              }}
            >
              Edit Description
            </p>
            <p
              className="el-proceed-btn"
              onClick={async () => {
                await setTimeout(() => {
                  goTo(2);
                }, 200);
              }}
            >
              Change Images
            </p>
            <p
              className="el-proceed-btn"
              onClick={async () => {
                await setTimeout(() => {
                  goTo(3);
                }, 200);
              }}
            >
              Update Pricing
            </p>
          </div>
        </div>
      </div>
    );
  }
}
