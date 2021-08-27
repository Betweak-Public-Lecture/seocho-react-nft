import React, { useState, useEffect, useCallback } from "react";
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

import Web3 from "web3";

function App() {
  const [web3, setWeb3] = useState(null);
  const [ethAccount, setEthAccount] = useState("");

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:9546");
    setWeb3(web3);
  }, []);

  const connectMetamask = useCallback(() => {
    // metmask 연결 로직
    console.log("Click the button");
    console.log(web3);
    web3.eth
      .requestAccounts()
      .then((accounts) => {
        if (accounts.length !== 0) {
          setEthAccount(accounts[0]);
        }
      })
      .catch((err) => {
        alert("로그인 실패");
      });
  }, [web3]);

  return (
    <Router>
      <Navbar
        connectMetamask={connectMetamask}
        web3={web3}
        ethAccount={ethAccount}
      />
      <Switch>
        <Route
          path="/mynft"
          exact={true}
          component={(props) => <MyNFTPage {...props} />}
        />
        <Route
          path="/minting"
          exact
          component={(props) => (
            <MintingPage {...props} web3={web3} ethAccount={ethAccount} />
          )}
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
