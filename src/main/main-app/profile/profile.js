import React from "react";
import { validField, _auth, _database, _storage } from "../../../config";
import "./profile.css";
import {
  EditInput,
  ImageUploader,
} from "../../../assets/components/Input/input";

export default class Profile extends React.Component {
  state = {
    loading: true,
    admin: {
      adminDp: "",
      adminId: _auth.currentUser.uid,
      phoneNumber: "",
      email: _auth.currentUser.email,
      fullName: "",
    },
  };
  async componentDidMount() {
    var { admin } = this.state;
    if (this.props.newUser !== true) {
      admin = this.props.admin;
    }
    this.setState({ admin, loading: false });
  }

  async uploadDp() {
    this.setState({ loading: true });
    const id = this.state.admin.adminId + new Date().getTime();
    const uploadTask = _storage
      .ref("admin/")
      .child(id + ".jpeg")
      .put(this.state.admin.adminDp);
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
                  const { admin } = this.state;
                  admin.adminDp = url;
                  this.setState({ admin, uploadPic: undefined });
                  await this.syncUser();
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
  async updateUser() {
    var { phoneNumber, email, fullName, adminDp } = this.state.admin;
    if (
      validField(adminDp) &&
      validField(phoneNumber) &&
      validField(fullName) &&
      validField(email)
    ) {
      this.props.showUnTimedToast();
      if (this.state.uploadPic) {
        await this.uploadDp();
      } else {
        await this.syncUser();
      }
    } else if (validField(adminDp) === false)
      this.props.showTimedToast("Profile photo required");
    else this.props.showTimedToast("All fields are required");
  }
  async syncUser() {
    var { admin } = this.state;
    this.setState({ loading: true });
    if (this.props.newUser)
      await _database.ref("admin/" + admin.adminId).set(admin);
    else await _database.ref("admin/" + admin.adminId).update(admin);
    this.setState({ loading: false });
    this.props.closeToast();
    this.props.showTimedToast("Save Successfull");
    await setTimeout(() => {
      window.open("/", "_self");
    }, 1500);
  }

  render() {
    return (
      <div className="profile-body">
        <div className="p-form">
          <h1>Edit Profile</h1>
          <h4>Fill out your details</h4>
          <ImageUploader
            src={this.state.admin.adminDp}
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
                  const { admin } = this.state;
                  admin.adminDp = blob;
                  this.setState({ admin, uploadPic: true });
                });
            }}
          />
          <EditInput
            value={this.state.admin.fullName}
            onChange={(e) => {
              const { admin } = this.state;
              admin.fullName = e.target.value;
              this.setState({ admin });
            }}
            name="Full Name"
            placeholder="John Snow"
          />
          <EditInput
            value={this.state.admin.phoneNumber}
            onChange={(e) => {
              const { admin } = this.state;
              admin.phoneNumber = e.target.value;
              this.setState({ admin });
            }}
            name="Whatsapp Contact"
            placeholder="+254798098595"
          />
          <div className="p-btns">
            <div
              id="left"
              className="p-btn"
              onClick={async () => {
                if (this.props.newUser)
                  await setTimeout(() => {
                    _auth.signOut().then(() => {
                      window.open(window.location.href, "_self");
                    });
                  }, 200);
                else
                  await setTimeout(() => {
                    this.props.closeEditing();
                  }, 200);
              }}
            >
              <p>Cancel</p>
            </div>
            <div
              className="p-btn"
              onClick={async () => {
                await setTimeout(() => {
                  this.updateUser();
                }, 200);
              }}
            >
              <p>Save</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
