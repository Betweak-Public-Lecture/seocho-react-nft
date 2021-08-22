import React from "react";
// react-bootstrap
import { Button } from "react-bootstrap";

import metamaskIcon from "./metamask.svg";

export default function MetaMask({ onClick }) {
  return (
    <Button variant="dark" onClick={onClick}>
      Connect <img src={metamaskIcon} style={{ width: 20 }} alt="metamask" />
    </Button>
  );
}
