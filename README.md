# 🏀 Bounce Ball

## Block Type
<img width="23" alt="Normall" src="https://github.com/user-attachments/assets/b015ff31-9b6f-4730-ae7f-7f8f6de443ff"> Normal: 일반적인 블럭, 공이 기본적인 바운스를 가질 뿐 다른 효과는 없다. <br/>
<img width="22" alt="Jump" src="https://github.com/user-attachments/assets/56bbf4fd-e3f6-42c4-bff8-4abc070ce5fb"> Jump: 점프 블럭, 공이 튀어 오르는 높이가 높아진다. <br/>
<img width="22" alt="Bomb" src="https://github.com/user-attachments/assets/6a704de4-4f98-4ed2-b01a-d9e3c77e0707"> Bomb: 폭탄 블럭, 공이 해당 블럭 위로 올라가면 게임이 실패한다. <br/>
<img width="24" alt="Fragile" src="https://github.com/user-attachments/assets/780bc2c2-4614-49bb-8f72-bc29ff427b15"> Fragile: 약한 블럭, 공이 해당 블럭 위로 튀겨지면 블럭이 사라진다. <br/>
<img width="24" alt="Wormhole" src="https://github.com/user-attachments/assets/95afd960-d338-4229-bd24-c43d22accf33"> Wormhole: 웜홀 블럭, 공이 해당 블럭에 접촉하면 다른 곳으로 순간이동한다.<br/>
<img width="23" alt="Fly" src="https://github.com/user-attachments/assets/9859fdc5-33bf-42a3-8c42-027e75b39da0"> Fly: 비행 블럭, 공이 해당 블럭 위로 올라가면 오른쪽/왼쪽으로 날아간다. 날아가는 도중 사용자는 날아가는 방향의 반대 키로 비행을 제어할 수 있다.

## User Action
📌 기본적으로 키보드 좌우 방향키를 이용하여 공을 움직인다.
- 공의 움직임에 관성을 적용하여, 공의 움직임 속도가 빠를수록 사용자는 공을 제어하기 위한 힘을 많이 들여야 한다. (ex. 공을 멈추게 하려면, 공의 속도가 빠를수록 그 반대 방향의 키를 더 오래 눌러야 한다.)
- JumpTheWall: 공이 벽을 타고 오르는 행동은, 공이 벽에 닿자 마자 벽에 닿는 방향의 반대방향 키를 누르면 된다.

## Trouble🐛
- 사용자 경험 증진을 위하여 공이 블럭과 접촉할 때 audio 효과를 삽입하였으나, github page 배포 시 오디오 효과가 딜레이되는 현상이 발생하여 현재는 오디오 효과를 비활성화 해놓은 상태이다.(2024/09/10)

## What to add
- 유저가 직접 맵을 구성할 수 있도록, 맵 에디터 (map editor)가 있으면 게임 이용 시 사용자 경험이 증진될 것이다.

### Page
🔗 https://taehyeungkim.github.io/BounceBall/
