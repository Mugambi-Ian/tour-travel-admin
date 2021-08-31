import React from "react";
import {
  EditInput,
  TextArea,
} from "../../../../../../assets/components/Input/input";

export default class ListingDescription extends React.Component {
  render() {
    const { CloseButton, listing, update, ProceedBtn } = this.props;
    return (
      <div className="el-content">
        <CloseButton />
        <h1>Description</h1>
        <EditInput
          value={listing.name}
          onChange={(e) => {
            listing.name = e.target.value;
            update({ listing });
          }}
          name="Package Name"
          placeholder="Safari Park Group Travel"
        />
        <TextArea
          value={listing.description}
          onChange={(e) => {
            listing.description = e.target.value;
            update({ listing });
          }}
          name="Package description"
          placeholder="Write more about your package"
        />
        <ProceedBtn />
      </div>
    );
  }
}
