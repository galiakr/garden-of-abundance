let currentRow = 0;
let currentPlant = 0;
let totalRows, plantsPerRow;
let plantingInterval;
let difficulty = 'easy';
let timeLeft = 0;
let timerInterval;
let score = 0;
let round = 1;
let maxRounds = 5;

function setDifficulty() {
  difficulty = document.getElementById('difficulty').value;
  updateDifficultySettings();
}

function updateDifficultySettings() {
  let maxValue;

  switch (difficulty) {
    case 'easy':
      maxValue = 5;
      break;
    case 'medium':
      maxValue = 7;
      break;
    case 'hard':
      maxValue = 10;
      break;
  }

  // Set random values for rows and plants based on difficulty
  totalRows = Math.floor(Math.random() * (maxValue - 1)) + 2;
  plantsPerRow = Math.floor(Math.random() * (maxValue - 1)) + 2;
}

function startGame() {
  score = 0;
  round = 1;
  updateScoreDisplay();
  startRound();
}

function startRound() {
  updateDifficultySettings();
  document.getElementById(
    'roundDisplay'
  ).textContent = `סִבּוּב ${round} מִתּוֹךְ ${maxRounds}`;
  document.getElementById('gameArea').style.display = 'block';
  document.getElementById('startButton').style.display = 'none';
  startPlanting();
}

function startPlanting() {
  const garden = document.getElementById('garden');
  garden.innerHTML = '';
  garden.style.gridTemplateColumns = `repeat(${plantsPerRow}, 120px)`;

  for (let i = 0; i < totalRows; i++) {
    for (let j = 0; j < plantsPerRow; j++) {
      const cell = document.createElement('div');
      cell.className = 'plant';
      cell.style.visibility = 'hidden';
      if (difficulty !== 'hard') {
        cell.classList.add('grid-line');
      }

      // Create the flower structure
      const flower = document.createElement('div');
      flower.className = 'flower';

      // Generate a single random color for the entire flower
      const flowerColor = getRandomColor();

      // Add leaves
      const leftLeaf = document.createElement('div');
      leftLeaf.className = 'leaf left';
      flower.appendChild(leftLeaf);

      const rightLeaf = document.createElement('div');
      rightLeaf.className = 'leaf right';
      flower.appendChild(rightLeaf);

      // Add colored petals with the same random color
      for (let k = 0; k < 6; k++) {
        const petal = document.createElement('div');
        petal.className = 'petal colored';
        petal.style.setProperty('--angle', `${k * 60}deg`);
        petal.style.setProperty('--petal-color', flowerColor);
        flower.appendChild(petal);
      }

      // Add pistil
      const pistil = document.createElement('div');
      pistil.className = 'pistil';
      flower.appendChild(pistil);

      cell.appendChild(flower);

      if (difficulty === 'easy') {
        const number = document.createElement('div');
        number.className = 'grid-number';
        number.textContent = (i * plantsPerRow + j + 1).toString();
        cell.appendChild(number);
      }
      garden.appendChild(cell);
    }
  }

  currentRow = 0;
  currentPlant = 0;
  const plantingSpeed =
    difficulty === 'easy' ? 1000 : difficulty === 'medium' ? 500 : 250;
  plantingInterval = setInterval(plantOne, plantingSpeed);
}

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
}

function plantOne() {
  if (currentRow < totalRows) {
    const plants = document.getElementsByClassName('plant');
    const plant = plants[currentRow * plantsPerRow + currentPlant];
    plant.style.visibility = 'visible';

    // Trigger animation
    const flower = plant.querySelector('.flower');
    flower.style.animation = 'none';
    flower.offsetHeight; // Trigger reflow
    flower.style.animation = 'flowerBloom 1s ease-out';

    currentPlant++;
    if (currentPlant === plantsPerRow) {
      currentRow++;
      currentPlant = 0;
    }
  } else {
    clearInterval(plantingInterval);
    document.getElementById('harvestBtn').style.display = 'block';
  }
}

function harvest() {
  document.getElementById(
    'result'
  ).textContent = `נֶהְדָּר! נִשְׁתְּלוּ ${totalRows} שׁוּרוֹת עִם ${plantsPerRow} צְמָחִים בְּכָל שׁוּרָה.`;
  document.getElementById('quizArea').style.display = 'flex';
  document.getElementById('quizAnswer').focus();
  document.getElementById('harvestBtn').style.display = 'none';

  askQuestion();
  startTimer();
}

function askQuestion() {
  let question, answer;
  switch (difficulty) {
    case 'easy':
      question = `כַּמָּה פְּרָחִים יֵשׁ בְּסַךְ הַכֹּל?`;
      answer = totalRows * plantsPerRow;
      break;
    case 'medium':
      if (Math.random() < 0.5) {
        question = `כַּמָּה פְּרָחִים יֵשׁ בְּסַךְ הַכֹּל?`;
        answer = totalRows * plantsPerRow;
      } else {
        question = `אִם יֵשׁ ${
          totalRows * plantsPerRow
        } פְּרָחִים בְּסַךְ הַכֹּל, כַּמָּה פְּרָחִים בְּכָל שׁוּרָה?`;
        answer = plantsPerRow;
      }
      break;
    case 'hard':
      const randomOperation = Math.random();
      if (randomOperation < 0.33) {
        question = `כַּמָּה פְּרָחִים יֵשׁ בְּסַךְ הַכֹּל?`;
        answer = totalRows * plantsPerRow;
      } else if (randomOperation < 0.66) {
        question = `אִם יֵשׁ ${
          totalRows * plantsPerRow
        } פְּרָחִים בְּסַךְ הַכֹּל, כַּמָּה פְּרָחִים בְּכָל שׁוּרָה?`;
        answer = plantsPerRow;
      } else {
        question = `אִם בְּכָל שׁוּרָה יֵשׁ ${plantsPerRow} פְּרָחִים, וְסַךְ הַכֹּל יֵשׁ ${
          totalRows * plantsPerRow
        } פְּרָחִים, כַּמָּה שׁוּרוֹת יֵשׁ?`;
        answer = totalRows;
      }
      break;
  }
  document.getElementById('quizQuestion').textContent = question;
  return answer;
}

// לַשָּׁלָב הַבָּא
function checkAnswer() {
  clearInterval(timerInterval);
  const userAnswer = parseInt(document.getElementById('quizAnswer').value);
  const correctAnswer = askQuestion();
  let pointsEarned = 0;

  if (userAnswer === correctAnswer) {
    pointsEarned = calculatePoints();
    score += pointsEarned;
    alert(
      `כָּל הַכָּבוֹד! תְּשׁוּבָה נְכוֹנָה! קִבַּלְתּ ${pointsEarned} נְקֻדּוֹת`
    );
  } else {
    alert(
      `לֹא בְּדִיּוּק. הַתְּשׁוּבָה הַנְּכוֹנָה הִיא ${correctAnswer}. מָה הַהֶסְבֵּר?: ${totalRows} × ${plantsPerRow} = ${
        totalRows * plantsPerRow
      }`
    );
  }

  updateScoreDisplay();
  nextRound();
  document.getElementById('result').textContent = '';
  document.getElementById('quizArea').style.display = 'none';
  document.getElementById('quizAnswer').value = '';
}

function calculatePoints() {
  let basePoints =
    difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
  let timeBonus = Math.max(0, timeLeft * 2);
  return basePoints + timeBonus;
}

function nextRound() {
  round++;
  if (round <= maxRounds) {
    startRound();
  } else {
    endGame();
  }
}

function endGame() {
  alert(`הַמִּשְׂחָק נִגְמַר! הַצִּיּוּן הַסּוֹפִי הוּא ${score} נְקֻדּוֹת`);
  document.getElementById('startButton').style.display = 'block';
  document.getElementById('gameArea').style.display = 'none';
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft =
    difficulty === 'easy' ? Infinity : difficulty === 'medium' ? 30 : 15;
  updateTimer();
  if (timeLeft !== Infinity) {
    timerInterval = setInterval(updateTimer, 1000);
  } else {
    timeLeft = 0;
  }
}

function updateTimer() {
  if (timeLeft > 0 && timeLeft !== Infinity) {
    document.getElementById(
      'timer'
    ).textContent = `זְמַן שֶׁנּוֹתַר: ${timeLeft} שְׁנִיּוֹת`;
    timeLeft--;
  } else if (timeLeft === 0) {
    clearInterval(timerInterval);
    alert('נִגְמַר הַזְּמַן! נַסּוּ שׁוּב');
    checkAnswer();
  } else if (timeLeft === Infinity) {
    document.getElementById('timer').textContent = '';
  }
}

function updateScoreDisplay() {
  document.getElementById('scoreDisplay').textContent = `צִיּוּן: ${score}`;
}

setDifficulty(); // Initialize difficulty
