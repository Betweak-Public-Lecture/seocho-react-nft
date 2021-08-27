import Web3 from "web3";
import snftAritfact from "../artifacts/SNFT.json";
import snftMarketArtifact from "../artifacts/SNFTMarket.json";
import erc721Artifact from "../artifacts/ERC721.json";

export const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:9546");

export const snftContract = new web3.eth.Contract(
  snftAritfact.abi,
  snftAritfact.networks["5777"].address
);
export const marketContract = new web3.eth.Contract(
  snftMarketArtifact.abi,
  snftMarketArtifact.networks["5777"].address
);

export const erc721Contract = new web3.eth.Contract(erc721Artifact.abi);

export default web3;
