// 코드의 성능 향상을 위해 과제 조건에 맞는 10000 만위로 나눈 시작 level 값을 먼저 구한다.
function getStartLevelForPerformance(diffs, times, limit) {
  const PERFORMANCE_LEVELS = Array(30).fill(0).map((_, i) => (i + 1) * 10000);
  
  let performanceLevelPosition;

  for (let i = 0; i < PERFORMANCE_LEVELS.length; i++) {
      const time = getTime(diffs, times, PERFORMANCE_LEVELS[i]);

      if (time <= limit) {
          performanceLevelPosition = i;
          break;
      }
  }

  let startLevel;
  if (performanceLevelPosition - 1 < 1) {
      startLevel = 1;
  } else {
      startLevel = PERFORMANCE_LEVELS[performanceLevelPosition - 1];
  }

  return startLevel;
}


// 각 n번째 퍼즐의 시간 소모를 구한다.
function getTime(diffs, times, level) {
  const loopCount = diffs.length;

  let totalTime = 0;

  for (let i = 0; i < loopCount; i++) {
      const diff = diffs[i];
      const timeCur = times[i];
      const timePrev = i === 0 ? 0 : times[i - 1];
      let time = 0;

      if (diff <= level) {
          time = timeCur;
      } else {
          const wrongCount = diff - level;
          time = (timeCur + timePrev) * wrongCount + timeCur;
      }

      totalTime += time;
  }

  return totalTime;
}

function solution(diffs, times, limit) {
  let limitLevel;
  
  const startLevel = getStartLevelForPerformance(diffs, times, limit);

  for (let i = startLevel; true; i++) {
      limitLevel = i;
      const time = getTime(diffs, times, limitLevel);

      if (time <= limit) {
          break;
      }
  }

  return limitLevel;
}
