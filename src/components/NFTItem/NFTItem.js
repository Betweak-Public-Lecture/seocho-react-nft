import React, { useEffect, useState } from "react";

import { Card, Button } from "react-bootstrap";
import web3, { snftContract, marketContract } from "../../utils/ether";
import { cidToHttps, ipfsToHttps } from "../../utils/helper";
/**
 * [연습문제]
 * - react-bootstrap의 카드를 이용해서 화면 구성을 완료하여라.
 * - 전달받은 tokenId props로 contract의 tokenURI를 호출하여라.
 * - tokenURI로 전달받은 cid를 활용해 링크를(anchor태그) 만들어주어라
 *          (http통신 https://ipfs.io/ipfs/${cid}/<file이름> (metadata.json))
 * - 받은 데이터를 컴포넌트에서 보여줘라
 */

export default function NFTItem({ tokenId }) {
  const [cid, setCid] = useState("");
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    description: "",
    image: "",
  });
  useEffect(() => {
    web3.eth.requestAccounts().then((accounts) => {
      snftContract.methods
        .tokenURI(tokenId)
        .call({
          from: accounts[0],
        })
        .then((cid) => {
          setCid(cid);
        });
    });
  }, [tokenId]);
  /**
   * [연습문제]
   * - 연습문제 cid가 변경되고 존재하면, fetch 를 이용해 metadata.json 내용을 읽어 화면에 보여주어라.
   * - image도 함께 출력하여라
   */
  useEffect(() => {
    if (cid) {
      const url = `${cidToHttps(cid)}/metadata.json`;
      fetch(url)
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          setTokenInfo(data);
        });
    }
  }, [cid]);

  useEffect(() => {
    fetch(
      "https://ipfs.io/ipfs/bafyreifryftuv4jjuvnn6hznn3rstjaayux7vku7do5mr6hyxkqncxpnha/metadata.json"
    )
      .then((resp) => {
        console.log("fetch완료");
        console.log(resp);
        return resp.json();
      })
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header>{tokenId}</Card.Header>
      <Card.Img
        variant="top"
        src={`${ipfsToHttps(tokenInfo.image)}`}
        style={{ height: 200, objectFit: "cover" }}
      />
      <Card.Body>
        {/* <a
          href={`${cidToHttps(cid)}/metadata.json`}
          target="_blank"
          rel="noreferrer"
        >
          링크
        </a> */}
        <Card.Title>{tokenInfo.name}</Card.Title>
        <Card.Text>{tokenInfo.description}</Card.Text>

        {/* 
            [연습문제]
            아래 버튼을 클릭하면 MarketContract의 createMarketItem Tx발생시켜라
         */}
        <Button
          variant="primary"
          onClick={async () => {
            const accounts = await web3.eth.requestAccounts();
            const account = accounts[0];
            const price = prompt("판매금액을 입력해주세요. (ether)");
            if (!price) {
              return;
            }
            console.log(account);
            console.log(snftContract.options.address);
            // 우리의 market에 동의되어있는지 체크
            const isApproval = await snftContract.methods
              .isApprovedForAll(account, marketContract.options.address)
              .call();
            console.log(isApproval);

            if (!isApproval) {
              const receipt = await snftContract.methods
                .setApprovalForAll(marketContract.options.address, true)
                .send({ from: account });
              console.log("승인 완료");
              console.log(receipt);
            }

            const receipt = await marketContract.methods
              .createMarketItem(
                snftContract.options.address,
                tokenId,
                web3.utils.toWei(price, "ether")
              )
              .send({
                from: account,
                value: web3.utils.toWei("0.001", "ether"),
              });
            console.log(receipt);
          }}
        >
          Sale
        </Button>
      </Card.Body>
    </Card>
  );
}
