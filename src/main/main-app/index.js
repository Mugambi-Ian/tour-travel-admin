import React from "react";
import Loader from "../../assets/components/loader/loader";
import { _auth, _database } from "../../config";
import Profile from "./profile/profile";
import Dashboard from "./dashboard/dashboard";
import MyDictionary from "../../assets/resources/my-dictionary";

export default class Home extends React.Component {
  state = {
    data: {
      currentUser: {},
      listings: new MyDictionary(),
    },
    currentScreen: "",
    loader: [
      false, //userData
      false, //listings
      false, //bookings
    ],
  };
  db = _database.ref();
  async componentDidMount() {
    await this.db.child("admin/" + _auth.currentUser.uid).on("value", (x) => {
      const { loader } = this.state;
      if (x.hasChild("phoneNumber")) {
        const { data } = this.state;
        data.currentUser = x.val();
        const v = new MyDictionary();
        x.child("bookings").forEach((i) => {
          const val = i.val();
          v.set(i.key, val);
        });
        data.bookings = v;
        let current = 0;
        x.child("bookings").ref.on("value", () => {
          if (loader[2]) {
            loader[2] = false;
            this.setState({ loader });
          }
        });
        data.bookings.listKeys().forEach((val) => {
          this.db.child(`bookings/${val}`).on("value", (j) => {
            this.db
              .child(`customers/${j.val().customerId}`)
              .on("value", (p) => {
                v.set(val, { ...j.val(), customer: p.val() });
                data.bookings = v;
                this.setState({ data });
                const { loader } = this.state;
                current = current + 1;
                if (current >= data.bookings.length()) {
                  loader[2] = true;
                  this.setState({ loader });
                }
                console.log(data, loader, current);
              });
          });
        });
      } else {
        this.setState({ currentScreen: "profile" });
      }
      loader[0] = true;
      this.setState({ loader });
    });
    await this.db
      .child("admin/" + _auth.currentUser.uid + "/destinations")
      .on("value", async (x) => {
        const { loader, data } = this.state;

        const v = new MyDictionary();
        const y = [];
        x.forEach((i) => {
          y.push(i.val());
        });
        for (let i = 0; i < y.length; i++) {
          const z = y[i];
          await this.db.child("destinations/" + z).on("value", (o, i) => {
            v.set(o.key, o.val());
            data.listings = v;
            this.setState({ loader, data });
          });
          if (i + 1 >= y.length) {
            loader[1] = true;
            data.listings = v;
            this.setState({ loader, data });
          }
        }
      });
  }
  componentWillUnmount() {
    this.db.off();
  }
  isLoading() {
    for (let i = 0; i < this.state.loader.length; i++) {
      const x = this.state.loader[i];
      if (!x) {
        return true;
      }
    }
    return false;
  }
  render() {
    const {
      data: { currentUser, listings, bookings },
      currentScreen,
    } = this.state;
    return this.isLoading() ? (
      <Loader />
    ) : currentScreen === "profile" ? (
      <Profile
        newUser={!currentUser.phoneNumber}
        admin={currentUser}
        closeToast={this.props.closeToast}
        showTimedToast={this.props.showTimedToast}
        showUnTimedToast={this.props.showUnTimedToast}
        closeEditing={() => {
          this.setState({ currentScreen: "dashboard" });
        }}
      />
    ) : (
      <Dashboard
        user={currentUser}
        bookings={bookings}
        listings={listings}
        closeToast={this.props.closeToast}
        showTimedToast={this.props.showTimedToast}
        showUnTimedToast={this.props.showUnTimedToast}
        revokeAccess={this.props.revokeAccess}
        editProfile={() => {
          this.setState({ currentScreen: "profile" });
        }}
      />
    );
  }
}
