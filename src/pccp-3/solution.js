// 시작지점 -> 종료지점 루프 실행 (모든 지점에 대해 루프를 실행함으로 시작 -> 종료, 시작 -> 경유 -> 경유 -> 종료 등의 다양한 케이스일 수 있음)
function getRobotPointsByRobotRoutes(points, robotRoutes, robotCurrentSteps) {
  const robotPoints = [];

  for (let i=0; i<robotRoutes.length-1; i++) {
    const startPoint = points[robotRoutes[i] - 1]; // 시작지점 또는 경유지점
    const endPoint = points[robotRoutes[i+1] - 1]; // 경유지점 또는 종료지점
    
    // 로봇이 움직여야하는 거리
    let robotNeedToMoveSteps = Math.abs(endPoint[0] - startPoint[0]) + Math.abs(endPoint[1] - startPoint[1]);

    const startToEndPoints = getStartToEndPointsBySteps(startPoint, endPoint, robotCurrentSteps, robotNeedToMoveSteps);
    robotPoints.push(...startToEndPoints);

    robotCurrentSteps += robotNeedToMoveSteps;
  }

  return robotPoints;
}

// 특정지점에서 특정지점까지의 좌표를 저장하는 함수
function getStartToEndPointsBySteps(start, end, robotCurrentSteps, robotNeedToMoveSteps) {
  const movePoints = [];

  const [a, b] = start;
  const [c, d] = end;
  
  // 처음 시작지점 처리
  if(robotCurrentSteps === 0) {
    robotNeedToMoveSteps += 1;
    movePoints.push(`${robotCurrentSteps},${a},${b}`);
  }

  // 현재지점 (x축, y축)
  let y = a;
  let x = b;

  // 현재 스탭 수에서 가야하는 스텝 수 만큼 루프
  for (let i = robotCurrentSteps+1; i <= robotCurrentSteps+robotNeedToMoveSteps; i++) {
      // 현재 지점과 종료 지점을 비교하여 y축 우선순위로 이동해야 하는 지점을 구함
      if (y !== c) {
          if (y > c) {
              y -= 1;
          } else {
              y += 1;
          }
      } else if (x !== d) {
          if (x > d) {
              x -= 1;
          } else {
              x += 1;
          }
      }
      
      // 이동한 지점을 저장
      movePoints.push(`${i},${y},${x}`);

      // 종료지점 도착 시 루프 종료
      if (y === c && x === d) {
        break;
    }
  }

  return movePoints;
}

// 이동한 걸음 수 및 지점에 대해 2개 이상의 충돌 위험이 있었는지 개수 측정
function getDuplicateCount (totalRobotsMovePoints) {
  const pointCount = {};
  for (const point of totalRobotsMovePoints) {
      pointCount[point] = (pointCount[point] || 0) + 1;
  }

  return Object.values(pointCount).reduce((total, count) => {
      return count >= 2 ? total + 1 : total;
  }, 0);
}

// 답안 제출
function solution(points, routes) {
  const robotCount = routes.length; // 로봇 개수

  const totalRobotsMovePoints = []; // 로봇들의 총 이동좌표 모음 배열

  // 로봇 별 루프 실행
  for(let robotNumber=0; robotNumber<robotCount; robotNumber++) {
    const robotRoutes = routes[robotNumber]; // 로봇의 경로 전체(시작지점, 경유지점, 종료지점)
    let robotCurrentSteps = 0; // 로봇의 현재 걸음 상태
    
    const robotPoints = getRobotPointsByRobotRoutes(points, robotRoutes, robotCurrentSteps) // 로봇 별 움직인 좌표모음
    totalRobotsMovePoints.push(...robotPoints);
  }

  const answer = getDuplicateCount(totalRobotsMovePoints);

  return answer;
}
