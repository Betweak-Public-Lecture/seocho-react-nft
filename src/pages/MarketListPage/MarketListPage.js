import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MarketItem from "../../components/MarketItem/MarketItem";
import { marketContract } from "../../utils/ether";

export default function MarketListPage() {
  /**
   * [연습문제]
   * MarketContract에서 fetchAvaiableMarketItems 호출하여
   * availabeItems라는 이름의 state로 저장하여라.
   */
  const [availableItems, setAvailableItems] = useState([]);
  // buyer: "0x0000000000000000000000000000000000000000"
  // itemId: "0"
  // nftContract: "0xD0b4366E91228e1CA320fBe29Ba22a27D4EFc1c8"
  // price: "2000000000000000000"
  // seller: "0x0DC56DDB6Cb4AC6862116c4E8c636237788749DC"
  // status: "1"

  useEffect(() => {
    marketContract.methods
      .fetchAvaiableMarketItems()
      .call()
      .then((data) => {
        console.log(data);
        setAvailableItems(data);
      });
  }, []);

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <h1>판매 목록</h1>
        </Col>
      </Row>
      <Row>
        {availableItems.map((item) => {
          return (
            <Col xs={4} className="my-3">
              <MarketItem marketItem={item} />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
