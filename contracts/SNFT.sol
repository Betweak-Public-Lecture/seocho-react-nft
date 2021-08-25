// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// https://eips.ethereum.org/EIPS/eip-721

contract SNFT is ERC721URIStorage {
    uint256 private _tokenId;

    // 생성자
    constructor() ERC721("Seocho NFT", "SNFT"){
    }

    /**
        [연습문제]
        - createToken 함수를 만드세요. 
        - 외부에서 접근가능해야하고, return값은 token의 Id값이여야 합니다.
        1. tokenID 정하기
        2. _mint 함수 호출하기    (ERC721.sol)
        3. _setTokenURI 호출하기 (ERC721URIStorage.sol)
     */
     function createToken(string memory _tokenURI) public returns(uint256){
         // _mint함수
         _mint(_msgSender(), _tokenId);
         _setTokenURI(_tokenId, _tokenURI);
         _tokenId++;
         return (_tokenId - 1);
     }

     /**
      * [연습문제]
      * fetchTokensByAddress(address _owner)함수
        - 외부에서 호출될 예정
        - _owner가 소유한 모든 token의 id값들을(배열) return
      */
      function fetchTokensByAddress(address _owner) external view returns (uint256[] memory){
          uint256 balance = balanceOf(_owner); // _owner가 소유한 NFT의 개수 ==> 반환할 배열의 길이
          uint256[] memory result = new uint256[](balance); // _owner가 소유한 NFT의 개수만큼 배열 생성

          /**
           - 0부터 token의 개수까지 반복하여 _owner가 소유한 tokenId만 (ownerOf함수. => )
           - result배열에 추가 
           */

          uint256 resultIdx = 0;
          for(uint256 i=0; i<_tokenId; i++){
              if(ownerOf(i) == _owner){
                  result[resultIdx] = i;
                  resultIdx++;
              }
          }
          return result;
      }
}