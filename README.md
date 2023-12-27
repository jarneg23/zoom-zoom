# zoom-zoom
zoom-zoom test

1. Change Node version to 18
```bash
nvm use 18
```

2. Install NPM Packages
```bash
npm install
```

3. Run the server
```sh
$ npm run start
```


### Architecture


Route

- get: /check/reservation  - 예약 확인

|    Name    |  Type  |  Desc  | Required | Extra |
|:----------:|:------:|:------:|:--------:| :---: |
|  sellerId  | number | 판매자 ID |    O     | - |
token| string |   토큰   |    O     |  - |

- get: /check/reservations - 예약 가능 날짜 확인

|    Name    |  Type  |  Desc  | Required | Extra |
|:----------:|:------:|:------:|:--------:| :---: |
|  sellerId  | number | 판매자 ID |    O     | - |
month| number |   월    |    O     |  - |
 
- post: /add/holiday - 판매자 휴일 추가

|    Name    |  Type  |        Desc        | Required | Extra |
|:----------:|:------:|:------------------:|:--------:| :---: |
|  sellerId  | number |       판매자 ID       |    O     | - |
holiday| string | 휴일 (2023-12-02 형식) |    O     |  - |

- post: /approve - 판매자가 대기 중인 예약 승인

|    Name    |  Type  |  Desc  | Required | Extra |
|:----------:|:------:|:------:|:--------:| :---: |
|  sellerId  | number | 판매자 ID |    O     | - |
token| string | token  |    O     |  - |

- post: /reserve - 고객 예약 신청

|   Name    |  Type  |  Desc  | Required | Extra |
|:---------:|:------:|:------:|:--------:| :---: |
| sellerId  | number | 판매자 ID |    O     | - |
  tourId   | number | 투어 ID  |    O     |  - |
| startDate | string | 시작 날짜 ('2023-02-12') |    O     | - |
|  endDate  | string | 종료 날짜 ('2023-02-13')  |    O     |  - |

- delete: /cancle - 고객 예약 취소

|   Name    |  Type  |  Desc  | Required | Extra |
|:---------:|:------:|:------:|:--------:| :---: |
| sellerId  | number | 판매자 ID |    O     | - |
token| string | token  |    O     |  - |




### ETC

- 추가 기능: History 관리

이유: 실제 운영 시 데이터 조작을 대상으로 history를 남기는 것에 대한 필요성을 많이 느끼기도 하며
실제로 남겨야 하는 경우도 많이 있었습니다. 

방식: 운영상 seller (클라이언트)의 경우에는 변경이 자주 있지 않고 특별하지 않은 경우에는
상태값을 추가한다거나 하는 방식으로 관리할 수 있지만 예약의 경우에는 빈번하게 취소가 되고 등록이 되기 때문에
별도의 history 저장을 위한 테이블을 만들고 수정에 대한 history를 관리하는 것으로 
사후에 발생할 이슈를 빠르게 디버깅 할 수 있도록 해당 기능을 추가하였습니다.