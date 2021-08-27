import React, { useEffect, useState } from "react";
import { web3, snftContract, marketContract } from "../../utils/ether";

import { Container, Row, Col, Button, Form } from "react-bootstrap";
import NFTList from "../../components/NFTList/NFTList";
import NFTItem from "../../components/NFTItem/NFTItem";

export default function MyNFTPage(props) {
  /**
   * 연습문제.
   * fetchTokensByAddress 호출. --> uint[]
   * 1. view함수입니다. 주의해서 호출.
   * (1-5). --> token의 id값으로 tokenURI를 조회
   * 2. Rendering(Bootstrap.Card형태로)
   */
  const [snftTokenIds, setSnftTokenIds] = useState([]);

  // fetchTokensByAddress 호출
  useEffect(() => {
    web3.eth.requestAccounts().then((accounts) => {
      snftContract.methods
        .fetchTokensByAddress(accounts[0])
        .call({
          from: accounts[0],
        })
        .then((myTokens) => {
          console.log(myTokens);
          setSnftTokenIds(myTokens);
        });
    });
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h2>My NFT</h2>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <h4>SNFT</h4>
        </Col>
      </Row>
      <Row>
        {snftTokenIds.map((tokenId) => {
          return (
            <Col xs={12} md={3} className="my-3">
              <NFTItem tokenId={tokenId} />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
