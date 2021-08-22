import React from "react";
import {
  Container,
  Navbar as BSNavbar,
  Nav,
  NavDropdown,
} from "react-bootstrap";

import { Link } from "react-router-dom";

import MetaMask from "../MetaMask/MetaMask";

export default function Navbar() {
  return (
    <BSNavbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          Home
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BSNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/market">
              Market
            </Nav.Link>

            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/minting">
              Mint an Item
            </Nav.Link>
            <Nav.Link as={Link} to="/mynft">
              My NFT
            </Nav.Link>

            <Nav.Item>
              <MetaMask />
            </Nav.Item>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
