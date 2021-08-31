import React from "react";
import Loader from "../../../../../assets/components/loader/loader";
import { _auth, _database, _storage } from "../../../../../config";
import ListingDescription from "./description/description";
import ListingPhotos from "./photos/photos";
import ListingPricing from "./pricing/pricing";
import ListingOverview from "./overview/overview";
import "./edit-listing.css";

let blockSave = false;
export default class EditListing extends React.Component {
  state = {
    listingExists: this.props.listing ? true : false,
    step: this.props.listing ? 4 : 1,
    listing: this.props.listing || {
      listingId: "",
      name: "",
      description: "",
      listingPhotos: [],
      listingPhotosBlob: [],
      listingDp: "",
      listingDpBlob: "",
      pricing: [],
      category: "",
      price: 0,
    },
  };
  CloseBtn = (props) => {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          maxHeight: "40px",
          justifyContent: "flex-end",
          marginBottom: "-40px",
        }}
      >
        <img
          onClick={async () => {
            await setTimeout(() => {
              props.onClick();
            }, 200);
          }}
          className="el-close-btn"
          alt=""
          src={
            this.state.step === 4
              ? require("../../../../../assets/drawables/ic-logout.png").default
              : require("../../../../../assets/drawables/ic-cancel.png").default
          }
        />
      </div>
    );
  };
  ProceedBtn = (props) => {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          maxHeight: "40px",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        <p
          className="el-proceed-btn"
          onClick={async () => {
            await setTimeout(() => {
              props.onClick();
            }, 200);
          }}
        >
          Proceed
        </p>
      </div>
    );
  };
  async saveLisiting() {
    this.setState({ step: 0 });
    const { listing } = this.state;
    this.props.showTimedToast("Saving");
    if (listing.uploadDp) {
      await this.uploadDp(listing);
    } else {
      await this._saveListing(listing);
    }
  }
  async _saveListing(listing) {
    if (listing.uploadPhotos) {
      await this.uploadPhotos(listing);
    } else {
      await this._send2Db(listing);
    }
  }
  async _send2Db(ev) {
    let { listingPhotos, listingDp, pricing, name, description, listingId } =
      ev;
    blockSave = true;
    if (!listingId)
      listingId = (await _database.ref("destinations").push()).key;
    await _database
      .ref("admin/" + _auth.currentUser.uid + "/destinations/" + listingId)
      .set(listingId);
    await _database.ref("destinations/" + listingId).set({
      listingPhotos,
      listingDp,
      pricing,
      name,
      description,
      listingId,
      adminId: _auth.currentUser.uid,
    });
    this.props.closeProcess();
    this.props.showTimedToast("Save Complete");
  }

  render() {
    const { step, listing, listingExists } = this.state;
    return (
      <div className="el-body">
        <div className={`el-form s${step}`}>
          {step === 0 ? (
            <Loader />
          ) : step === 1 ? (
            <ListingDescription
              listing={listing}
              update={(update) => this.setState({ ...update })}
              CloseButton={() => {
                return (
                  <this.CloseBtn
                    onClick={() => {
                      if (listingExists) this.setState({ step: 4 });
                      else this.props.closeProcess();
                    }}
                  />
                );
              }}
              ProceedBtn={() => {
                return (
                  <this.ProceedBtn
                    onClick={() => {
                      if (listing.name && listing.description)
                        if (!listingExists) this.setState({ step: 2 });
                        else this.saveLisiting();
                      else
                        this.props.showTimedToast(
                          "Name and Description required!"
                        );
                    }}
                  />
                );
              }}
            />
          ) : step === 2 ? (
            <ListingPhotos
              listing={listing}
              update={(update) => this.setState({ ...update })}
              CloseButton={() => {
                return (
                  <this.CloseBtn
                    onClick={() => {
                      if (listingExists) this.setState({ step: 4 });
                      else this.setState({ step: 1 });
                    }}
                  />
                );
              }}
              ProceedBtn={() => {
                return (
                  <this.ProceedBtn
                    onClick={() => {
                      if (listing.listingDp)
                        if (!listingExists) this.setState({ step: 3 });
                        else this.saveLisiting();
                      else this.props.showTimedToast("Display Photo Required");
                    }}
                  />
                );
              }}
            />
          ) : step === 3 ? (
            <ListingPricing
              listing={listing}
              update={(update) => this.setState({ ...update })}
              CloseButton={() => {
                return (
                  <this.CloseBtn
                    onClick={() => {
                      if (listingExists) this.setState({ step: 4 });
                      else this.setState({ step: 2 });
                    }}
                  />
                );
              }}
              ProceedBtn={() => {
                return (
                  <this.ProceedBtn
                    onClick={() => {
                      if (listing.pricing.length > 0) {
                        this.saveLisiting();
                      } else this.props.showTimedToast("Pricing Required");
                    }}
                  />
                );
              }}
              showTimedToast={this.props.showTimedToast}
            />
          ) : step === 4 ? (
            <ListingOverview
              listing={listing}
              update={(update) => this.setState({ ...update })}
              CloseButton={() => {
                return (
                  <this.CloseBtn
                    onClick={() => {
                      this.props.closeProcess();
                    }}
                  />
                );
              }}
              goTo={(x) => {
                this.setState({ step: x });
              }}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
  async uploadImage(x, v) {
    const id =
      new Date().getTime() + "_" + Math.floor(Math.random() * 5000) + 1;
    const uploadTask = _storage
      .ref("event/" + _auth.currentUser.uid)
      .child(id)
      .put(x);
    await uploadTask
      .on(
        "state_changed",
        function () {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(
              async function (downloadURL) {
                await setTimeout(async () => {
                  var url = "" + downloadURL;
                  const u = v.bind(this);
                  u(url);
                }, 1000);
              }.bind(this)
            )
            .catch(async (e) => {
              console.log(e);
            });
        }.bind(this)
      )
      .bind(this);
  }
  async uploadDp(ev) {
    await this.uploadImage(ev.listingDpBlob, async (x) => {
      let { listing } = this.state;
      listing = { ...listing, listingDp: x, listingDpBlob: "", uploadDp: "" };
      this.setState({ listing });
      await this._saveListing(listing);
    });
  }
  async uploadPhotos(ev) {
    for (let i = 0; i < ev.listingPhotosBlob.length; i++) {
      const p = ev.listingPhotosBlob[i];
      await this.uploadImage(p, (x) => {
        let { listingPhotos, listing } = this.state;
        if (listingPhotos) {
          listingPhotos.push(x);
        } else {
          listingPhotos = [x];
        }
        this.setState({ listing, listingPhotos });
      });
    }
  }
  async shouldComponentUpdate(nextProps, nextState) {
    let { listing, listingPhotos } = nextState;
    if (
      !blockSave &&
      listingPhotos &&
      listingPhotos.length === listing.listingPhotos.length
    ) {
      blockSave = true;
      listing.listingPhotos = listingPhotos;
      this._send2Db(listing);
      return false;
    }
    return true;
  }
}
