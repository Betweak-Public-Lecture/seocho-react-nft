import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import web3, { erc721Contract, marketContract } from "../../utils/ether";
import { cidToHttps, ipfsToHttps } from "../../utils/helper";

export default function MarketItem({ marketItem }) {
  const [metadataURL, setMetadataURL] = useState("");
  const [nftSymbol, setNftSymbol] = useState("");

  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [priceWithFee, setPriceWithFee] = useState("");
  useEffect(() => {
    marketContract.methods
      .getPriceWithFee(marketItem.itemId)
      .call()
      .then((price) => {
        setPriceWithFee(price);
      });
  });

  useEffect(() => {
    const nftContract = erc721Contract.clone();
    nftContract.options.address = marketItem.nftContract;

    nftContract.methods
      .tokenURI(marketItem.tokenId)
      .call()
      .then((cid) => {
        setMetadataURL(`${cidToHttps(cid)}/metadata.json`);
      });

    nftContract.methods
      .symbol()
      .call()
      .then((symbol) => {
        setNftSymbol(symbol);
      });
  }, []);

  // metadataURL에 접근해서 .tokenInfo 가져오기
  useEffect(() => {
    if (metadataURL) {
      fetch(metadataURL)
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          setTokenInfo(data);
        });
    }
  }, [metadataURL]);

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header>{marketItem.itemId}</Card.Header>
      <Card.Img variant="top" src={`${ipfsToHttps(tokenInfo.image)}`} />
      <Card.Body>
        <Card.Title>{tokenInfo.name}</Card.Title>
        <Card.Title>{web3.utils.fromWei(priceWithFee, "ether")} ETH</Card.Title>
        <Card.Text>{tokenInfo.description}</Card.Text>
        <Card.Text>
          <strong>seller: </strong>
          <small>{marketItem.seller}</small>
        </Card.Text>
        {/*
        [연습문제] 
        Buy버튼을 클릭하면 구매가 되도록 하세요.
        구매가되면 구매자 계정의 MyNFT에서 확인가능.
                  판매자 계정의 MyNFT에서는 사라짐.  
         */}
        <Button
          variant="primary"
          onClick={async (e) => {
            e.preventDefault();
            const accounts = await web3.eth.requestAccounts();
            const account = accounts[0];
            const receipt = await marketContract.methods
              .createMarketSale(marketItem.itemId)
              .send({
                from: account,
                value: priceWithFee,
              });
            console.log(receipt);
          }}
        >
          Buy
        </Button>
      </Card.Body>
      <Card.Footer>
        <div>{nftSymbol}</div>
      </Card.Footer>
    </Card>
  );
}
