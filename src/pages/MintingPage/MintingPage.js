import React, { useState, useCallback } from "react";

import { Container, Row, Col, Button } from "react-bootstrap";

import ImageUploader from "react-images-upload";
import { NFTStorage, File } from "nft.storage";

const client = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBFYzExRkE1OGIzMUY3MzEzM2M2NmM3QzAzNGRmNzdDMEE5NWU1NjMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyOTYyMTI4NTAxOSwibmFtZSI6IlNORlQifQ.dpre3408KrKnnz_X6Myk2NYnSvAdBY-jV7lu2qvMwK8",
});

export default function MintingPage() {
  const [image, setImage] = useState(null);

  const onMint = useCallback(async (e) => {
    e.preventDefault();
    if (!image) {
      return false;
    }
    const token = await client.store({
      name: "sample_name",
      description: "sample_desc",
      image: new File(image, image[0].name, {
        type: image[0].type,
      }),
    });
    console.log(token);
  }, []);

  return (
    <Container>
      <Row className="mt-5 mb-3">
        <Col>
          <h2>Mint an Item</h2>
        </Col>
      </Row>
      <Row>
        <ImageUploader
          onChange={(image) => {
            console.log(image);
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
