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
         address buyer;         // 구매자의 account address (만약 아직 거래전: address(0))
         uint8 status;          // 판매 상태 여부(status=0: 취소, status=1:판매중, status=2: 판매완료)
     }

     uint256 private _itemIds;          // MarketItem의 id관리
     uint256 private _itemSoldCount;    // 팔린 MarketItem의 개수
     uint256 private _itemCancelCount;  // 취소된 MarketItem의 개수

     uint256 listingPrice = 0.001 ether;
     uint256 percentPrice = 10;

    // key: itemId, value: MarketItem mapping
     mapping(uint256 => MarketItem) idToMarketItem;

    // key: ContractAddress value mapping(uint256(_tokenId)=>bool(true, false))
    mapping(address=> mapping(uint256 => bool)) private _alreadyListingItem;


    // uint256 private _itemIds;          // MarketItem의 id관리
    //  uint256 private _itemSoldCount;    // 팔린 MarketItem의 개수
    //  uint256 private _itemCancelCount;  // 취소된 MarketItem의 개수

    function itemCount() public view returns(uint256){
        return _itemIds;
    }
    function itemSoldCount() public view returns(uint256){
        return _itemSoldCount;
    }
    function itemCancelCount() public view returns(uint256){
        return _itemCancelCount;
    }
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
    /**
    [연습문제3 - 아이템 판매 취소 tx 정의하기]
    cancelMarketItem(uint _itemId) 
    - 외부에서 접근이 가능하도록
    - 현재 판매하는 상품 대상으로만 설정 가능
    - 해당 token의 주인이 실제 해당 token의 소유주가 맞는지
    - 취소하는 로직 

    판매자가 호출
    */
    function cancelMarketItem(uint256 _itemId) public{
        // 0. marketItem 불러오기
        // memory? storage?
        MarketItem storage targetItem = idToMarketItem[_itemId];

        // 1. require로 현재 상품이 판매 중인지 체크
        require(targetItem.status == 1);

        // 2. 해당 token의 주인이 실제 해당 token의 소유주가 맞는지
        require(_msgSender() == targetItem.seller);

        // 3. 취소 로직
        // 3-1. _alreadyListingItem => false
        _alreadyListingItem[targetItem.nftContract][targetItem.tokenId] = false;
        // 3-2. idToMarketItem의 해당 item을 찾아서 status를 변경
        targetItem.status = 0;
        // 3-3. _itemCancelCount 증가.
        _itemCancelCount++;
    }

    /**
    [연습문제4 - 아이템 구매 tx 정의하기]
    createMarketSale(uint _itemId)
    - 외부에서 접근이 가능하도록
    - 현재 판매하는 상품 대상으로만 설정 가능
    - ethereum을 해당 MarketItem의 Price 이상 만큼 지급받아야 합니다.(만약 초과해서 전달시 거스름돈 전달)
    - 아직 거래가 체결되지 않았어야 합니다.
    - 실제 SNFT의 contract를 발생시켜야 합니다.
    - itemSoldCount 증가시켜야 합니다.
    - 판매대금만큼의 ethereum을 seller에게 전달해야 합니다.
    - buyer 기록하고, status 변경 해야 합니다.

    구매자가 호출.
     */
     function createMarketSale(uint256 _itemId) external payable {
         // 0. marketItem 불러오기
         // memory vs storage?
         MarketItem storage targetItem = idToMarketItem[_itemId];
         // 1. ethereum을 해당 marketItem의 price이상 지급 받아야 합니다. (+수수료)
         uint256 priceWithFee = getPriceWithFee(_itemId);
         require(msg.value >= priceWithFee);
         
         // 2. 현재 판매하는 상품 대상으로만 설정 가능
         require(targetItem.buyer == address(0));
         require(targetItem.status==1);
         require(_alreadyListingItem[targetItem.nftContract][targetItem.tokenId]);

         // 3. 거스름돈 계산
         uint256 cashback = targetItem.price - priceWithFee;

         // 4. 실제 tx 실행 로직
        //  외부에 있는 Contract의 TX을 발생시키기 위해서 필요한 것 2개 (interface, CA address)

        IERC721(targetItem.nftContract).transferFrom(targetItem.seller, _msgSender(), targetItem.tokenId);
        _alreadyListingItem[targetItem.nftContract][targetItem.tokenId] = false;
        // 구매자 설정
        targetItem.buyer = _msgSender();
        targetItem.status = 2;
        _itemSoldCount++;

        /* 이더 전달: transfer vs send */
        // 5. 거스름돈 전달 (구매자에게 전달) - _msgSender() = msg.sender
        // _msgSender().transfer(cashback); // 0.4
        // address(uint160(_msgSender())).transfer(cashback); // 0.5
        address payable buyer = payable(_msgSender()); // >= 0.6
        buyer.transfer(cashback); // >= 0.6

        // 6. 판매대금 전달 (판매자에게 전달) - targetItem.seller
        // targetItem.seller.transfer(targetItem.price); // 0.4
        // address(uint160(targetItem.seller)).transfer(targetItem.price); // 0.5

        address payable seller = payable(targetItem.seller); // >= 0.6
        seller.transfer(targetItem.price); // >= 0.6
     }

     function getPriceWithFee(uint256 _itemId) public view returns(uint256) {
         MarketItem memory targetItem = idToMarketItem[_itemId];
         return targetItem.price * percentPrice / 100;
     }

     /**
      [연습문제5 - 팔리지 않은 모든 marketItem 조회하기]
      fetchAvaiableMarketItems() 정의
      - 외부에서 접근 가능해야 합니다.
      - 조회만 합니다. 가스 최적화 해주세요( OO 접근 제어자 이용)
      - return 값은 MarketItem의 배열이여야 합니다. (여러개)
      - 팔리지 않은 모든 Item들을 return해야합니다.
      */
      function fetchAvaiableMarketItems() external view returns(MarketItem[] memory){
        uint256 totalItemCount = _itemIds;
        uint256 avaiableItemCount = totalItemCount - _itemSoldCount - _itemCancelCount;
        
        // 이용할 수 있는 모든 item을 전체 mapping을 순회하면서 배정.
        // memory vs storage   
        MarketItem[] memory avaiableMarketItems = new MarketItem[](avaiableItemCount);

        uint256 itemIdx = 0;
        for (uint256 i=0; i<totalItemCount; i++){
            if(idToMarketItem[i].status == 1){
                avaiableMarketItems[itemIdx] = idToMarketItem[i];
                itemIdx++;
            }
        }
        return avaiableMarketItems;
      }
 }