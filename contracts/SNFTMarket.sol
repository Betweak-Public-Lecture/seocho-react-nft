// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
MarketContract
- ERC721 Contract에 접근하여 소유권을 이전시킬 수 있어야 함.
 */

// [요구사항] 
// - MarketContract는 수수료를 받을 예정.
// (두 종류 - ) 
// 1. listingPrice(판매를 올려놓는) --> 절대적인금액
// 2. percentage로(구매할때 발생하는) --> 판매가격에 상대가격

// [수수료를 수취 --> 출금할 수 있어야 함. --> Contract의 소유권이 존재해야함.]
// Openzeppelin's Ownable 상속
 contract SNFTMarketContract is Ownable {
     event MarketItemCreated(
         uint256 itemId,
         uint256 tokenId,
         uint256 price,
         address nftContract,
         address seller,
         address buyer,
         uint8 status
     );

     struct MarketItem{
         uint256 itemId;        // SNFT Market에서 관리하는 id
         uint256 tokenId;       // NFT Contract(SNFT에서) 관리하는 id
         uint256 price;         // user가 팔기를 희망하는 금액
         address nftContract;   // NFT ContractAddress(ERC721 - SNFT)
         address seller;        // 파는 사람의 account address
         address buyer;         // 구매자의 account address
         uint8 status;          // 판매 상태 여부(status=0: 취소, status=1:판매중, status=2: 판매완료)
     }

     uint256 private _itemIds;          // MarketItem의 id관리
     uint256 private _itemSoldCount;    // 팔린 MarketItem의 개수
     uint256 listingPrice = 0.001 ether;
     uint256 percentPrice = 10;

    // key: itemId, value: MarketItem mapping
     mapping(uint256 => MarketItem) private idToMarketItem;

    // key: ContractAddress value mapping(uint256(_tokenId)=>bool(true, false))
    mapping(address=> mapping(uint256 => bool)) private _alreadyListingItem;

     /**
     [연습문제1.]
     setListingPrice와 setPercentPrice를 정의하세요.
     - 외부에서 접근이 가능하도록 정의하고, 내용은 listingPrice를 변경할 수 있어야 합니다.
     - 반드시 Contract의 소유주만 호출이 가능하도록 구성

     + withdraw함수(uint256 _amount)까지 구현! (CA => owner(EOA)로 전송하는)
      */
    function setListingPrice(uint256 _listingPrice) external onlyOwner {
        listingPrice = _listingPrice;
    }
    function setPercentPrice(uint256 _percentPrice) external onlyOwner{
        require(_percentPrice<=100 && _percentPrice>=0);
        percentPrice = _percentPrice;
    }

    function withdraw(uint256 _amount) external onlyOwner{
        /**
         solidity^0.4
         > adress owner = owner();
         > owner.transfer(_amount)
         */
         /**
         soldity^0.5
         > address owner = address(uint160(owenr()))
          */

        //   solidty > 0.6
        address payable owner = payable(owner());
        owner.transfer(_amount);
        
    }
    /**
     [연습문제2] --> 판매 등록하기
     createMarketItem(address _nftContract, uint256 _tokenId, uint256 _price)정의
     - 외부에서 접근 가능
     - ethereum을 listingPrice만큼 지급받아야 함
     - 현재 _nftContract의 _tokenId가 현재 판매중인지 확인(_alreadyListingItem 활용) 
     - _price는 0보다 커야합니다. (판매금액)

     
     - 해당 _tokenId의 소유주가 정말 contract 요청한 address가 맞는지
     
     ----
     - _itemIds를 1씩 증가시키면서 idToMarketItem의 id로써 사용되어야 합니다.
     -> 판매중으로 명시
     -> 이벤트 호출
     
     판매자가 호출

     */
     function createMarketItem(address _nftContract, uint256 _tokenId, uint256 _price) public payable{
         // 1. listingPrice 지급 받은지 확인
         require(msg.value == listingPrice);

         // 2. 현재 _nftContract의 _tokenId가 판매중인지 확인(_alreadyListingItem)
         //  mapping(address=> mapping(uint256 => bool)) private _alreadyListingItem;
        require(!_alreadyListingItem[_nftContract][_tokenId]);
         // 3. price >0 
        require(_price >0);

        // 해당 _tokenId의 소유자가 정말 Contract요청한 address(판매자)가 맞는지 확인.
        address nftOwner = IERC721(_nftContract).ownerOf(_tokenId);
        require(nftOwner == _msgSender());
        // _msgSender() == msg.sender
        
        _alreadyListingItem[_nftContract][_tokenId] = true;

    //  struct MarketItem{
    //      uint256 itemId;        // SNFT Market에서 관리하는 id
    //      uint256 tokenId;       // NFT Contract(SNFT에서) 관리하는 id
    //      uint256 price;         // user가 팔기를 희망하는 금액
    //      address nftContract;   // NFT ContractAddress(ERC721 - SNFT)
    //      address seller;        // 파는 사람의 account address
    //      address buyer;         // 구매자의 account address
    //      uint8 status;          // 판매 상태 여부(status=0: 취소, status=1:판매중, status=2: 판매완료)
    //  }
        idToMarketItem[_itemIds] = MarketItem(
            _itemIds, 
            _tokenId, 
            _price, 
            _nftContract, 
            _msgSender(),
            address(0),
            1);
        _itemIds++;
        emit MarketItemCreated(_itemIds, _tokenId, _price, _nftContract, _msgSender(), address(0), 1);
     }
     

 }