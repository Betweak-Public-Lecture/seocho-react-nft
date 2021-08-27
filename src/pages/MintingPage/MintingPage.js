import React, { useState, useCallback, useEffect } from "react";

import { Container, Row, Col, Button, Form } from "react-bootstrap";

import ImageUploader from "react-images-upload";
import { NFTStorage, File } from "nft.storage";
import SNFTArtifact from "../../artifacts/SNFT.json";
import { web3, snftContract, marketContract } from "../../utils/ether";

const client = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBFYzExRkE1OGIzMUY3MzEzM2M2NmM3QzAzNGRmNzdDMEE5NWU1NjMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyOTYyMTI4NTAxOSwibmFtZSI6IlNORlQifQ.dpre3408KrKnnz_X6Myk2NYnSvAdBY-jV7lu2qvMwK8",
});
/**
 * [연습문제 - web3와 artifacts들을 이용해 SNFT컨트랙트에 createToken Tx을 발생시키세요]
 * 1. SNFT.json artifacts를 import
 * 2. SNFT.json을 가지고 web3의 Contract 객체를 생성한다. (useEffect)
 * 3. token의 ipnft를 createToken을 호출함으로써 TX (onMint 내에서 사용)
 */

export default function MintingPage({ history, location, match }) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onMint = useCallback(
    async (e) => {
      e.preventDefault();
      if (!image || !title || !description) {
        console.log("title, description, image is required");
        return false;
      }
      const accounts = await web3.eth.requestAccounts();
      if (accounts.length === 0) {
        return;
      }
      const account = accounts[0];
      console.log(account);

      const token = await client.store({
        name: title,
        description: description,
        image: new File(image, image[0].name, {
          type: image[0].type,
        }),
      });
      const { ipnft, url, data } = token;
      console.log(token);

      const receipt = await snftContract.methods.createToken(ipnft).send({
        from: account,
      });
      console.log(receipt);
      alert("Minting!");
    },
    [image, title, description, snftContract]
  );
  /**
   * [연습문제]
   * react-bootstrap의 Form.Control을 이용해서
   * name, description을 입력받아(state 사용 필수) minting(ipfs에 기록)
   */

  return (
    <Container>
      <Row className="mt-5 mb-3">
        <Col>
          <h2>Mint an Item</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
            />
            <Form.Text className="text-muted">Must be inserted</Form.Text>
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              rows={5}
              as="textarea"
              placeholder="Type something"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <ImageUploader
          onChange={(image) => {
            setImage(image);
          }}
          withPreview={true}
          accept="accept=image/*"
          label="Max file size: 20mb, accepted: jpg"
          imgExtension={["png", "gif", "jpg", "jpeg"]}
          maxFileSize={20 * 1024 * 1024}
          singleImage={true}
        />
      </Row>
      <Row>
        <Col>
          <Button onClick={onMint}>Mint</Button>
        </Col>
      </Row>
    </Container>
  );
}
