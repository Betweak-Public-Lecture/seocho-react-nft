const BASE_URL = "https://ipfs.io/ipfs";
export function cidToHttps(cid) {
  return `${BASE_URL}/${cid}`;
}

export function ipfsToHttps(ipfsUrl) {
  const url = ipfsUrl.substr("ipfs://".length, ipfsUrl.length);
  return `${BASE_URL}/${url}`;
}
