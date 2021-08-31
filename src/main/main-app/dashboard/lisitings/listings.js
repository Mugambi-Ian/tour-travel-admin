import React from "react";
import Lottie from "react-lottie";
import { _database } from "../../../../config";
import EditListing from "./edit-listing/edit-listing";
import "./listings.css";

export default class Listings extends React.Component {
  state = {
    editListing: undefined,
    currentView: 0,
    listingEnterance: "fade-right",
  };

  lisitingCard(p, i) {
    return (
      <li className="lisiting-card" key={i}>
        <img alt={p.lisitingName} src={p.listingDp} />
        <div className="info">
          <h2 className="title ">{p.name}</h2>
        </div>
        <div
          className="btn "
          onClick={async () => {
            await setTimeout(() => {
              this.setState({ editListing: p });
            }, 100);
          }}
        >
          Update Listing
        </div>
        <div
          id={p.hidden ? "hidden" : "visible"}
          className="btn"
          onClick={async () => {
            await setTimeout(async () => {
              this.props.showUnTimedToast();
              await _database
                .ref(`destinations/${p.listingId}`)
                .update({ hidden: !p.hidden });
              this.props.closeToast();
            }, 100);
          }}
        >
          {p.hidden ? "Activate Listing" : "Remove Listing"}
        </div>
      </li>
    );
  }
  render() {
    const { listings } = this.props;  
    const st = this.state;
    return (
      <>
        <div className="listing-body">
          {listings.listKeys().length === 0 ? (
            <div className="no-listings">
              <div id="animation">
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: require("../../../../assets/animations/mov-start.json"),
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                />
                <div id="down-anim">
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: require("../../../../assets/animations/mov-down.json"),
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice",
                      },
                    }}
                  />
                </div>
              </div>  
              <p className="unselectable">
                Register your listing to get started
              </p>
            </div>

          ) : (
            <ol className="lisitings-list">
              {listings.getVaules().map((d, i) => {
                return this.lisitingCard(d, i);
              })}
              <div style={{ minHeight: "100px" }} />
            </ol>
          )}
          <div
            className="listing-button"
            onClick={async () => {
              if (this.state.editListing === undefined)
                await setTimeout(() => {
                  this.setState({ editListing: "new" });
                }, 200);
            }}
          >
            <p className="unselectable">Create Listing</p>
          </div>
        </div>
        {st.editListing ? (
          <EditListing
            listing={st.editListing === "new" ? undefined : st.editListing}
            closeToast={this.props.closeToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
            closeProcess={() => {
              this.setState({ editListing: undefined });
            }}
          />
        ) : (
          ""
        )}
      </>
    );
  }
}
