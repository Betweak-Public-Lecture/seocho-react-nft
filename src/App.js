import React, { useState } from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//bootstrap import
import "bootstrap/dist/css/bootstrap.min.css";

// component import
import Navbar from "./components/Navbar/Navbar";

// page Import
import MyNFTPage from "./pages/MyNFTPage/MyNFTPage";
import MintingPage from "./pages/MintingPage/MintingPage";
import MarketListPage from "./pages/MarketListPage/MarketListPage";
import MarketDetailPage from "./pages/MarketDetailPage/MarketDetailPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route
          path="/mynft"
          exact={true}
          component={(props) => <MyNFTPage {...props} />}
        />
        <Route
          path="/minting"
          exact
          component={(props) => <MintingPage {...props} />}
        />

        <Route
          path="/market"
          exact
          component={(props) => <MarketListPage {...props} />}
        />
        <Route
          path="/market/:id"
          exact
          component={(props) => <MarketDetailPage {...props} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
