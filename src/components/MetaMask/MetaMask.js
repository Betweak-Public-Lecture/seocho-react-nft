import React from "react";
// react-bootstrap
import { Button } from "react-bootstrap";

import metamaskIcon from "./metamask.svg";

export default function MetaMask() {
  return (
    <Button variant="dark">
      Connect
      <img src={metamaskIcon} style={{ width: 20 }} alt="metamask" />
    </Button>
  );
}
