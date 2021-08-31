import React from "react";
import { ImageUploader } from "../../../../../../assets/components/Input/input";
import "./photos.css";
export default class ListingPhotos extends React.Component {
  render() {
    const { CloseButton, listing, ProceedBtn, update } = this.props;
    return (
      <div className="el-content">
        <CloseButton /> <h1>Photos</h1>
        <div style={{ flex: 1, display: "flex" }}>
          <ImageUploader
            src={listing.listingDp}
            hideField={() => {
              this.setState({ hideField: true });
            }}
            showField={() => {
              this.setState({ hideField: undefined });
            }}
            updateValue={(x) => {
              fetch(x)
                .then((res) => res.blob())
                .then((blob) => {
                  listing.listingDp = x;
                  listing.listingDpBlob = blob;
                  listing.uploadDp = true;
                  update({ listing });
                });
            }}
            title="Click to upload listing DP"
          />

          <div className="el-photo-content">
            <p>Add extra photos</p>{" "}
            <input
              accept="image/*"
              type="file"
              onChange={(event) => {
                const img = event.target.files[0];
                const i = new Image();
                i.onload = () => {
                  if (listing.listingPhotos.length < 5) {
                    fetch(URL.createObjectURL(img))
                      .then((res) => res.blob())
                      .then((blob) => {
                        listing.listingPhotos.push(URL.createObjectURL(img));
                        if (listing.listingPhotosBlob)
                          listing.listingPhotosBlob.push(blob);
                        else listing.listingPhotosBlob = [blob];
                        listing.uploadPhotos = true;
                        update({ listing });
                      });
                  } else {
                    this.props.showTimedToast("Limit Execeeded!");
                  }
                };
                i.src = URL.createObjectURL(img);
              }}
            />
            <div className="posters">
              {listing.listingPhotos.map((x, i) => {
                return (
                  <div className="poster-card">
                    <img
                      className="pc-close unselectable"
                      alt="icon"
                      src={
                        require("../../../../../../assets/drawables/ic-cancel.png")
                          .default
                      }
                      onClick={async () => {
                        await setTimeout(() => {
                          try {
                            listing.listingPhotos.splice(i, 1);
                            listing.listingPhotosBlob.splice(i, 1);
                          } catch (e) {
                            console.log(e);
                          }
                          update({ listing });
                        }, 200);
                      }}
                    />
                    <img className="pc unselectable" alt="icon" src={x} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <ProceedBtn />
      </div>
    );
  }
}
