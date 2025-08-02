    const game = document.getElementById('game');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const genderScreen = document.getElementById('genderScreen');
    const instructionScreen = document.getElementById('instructionScreen');
    const gameScreen = document.getElementById('gameScreen');
    const resultScreen = document.getElementById('resultScreen');
    const heartTotal = document.getElementById('heartTotal');
    const loveMessage = document.getElementById('loveMessage');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const ctx = confettiCanvas.getContext("2d");

    let score = 0;
    let timeLeft = 30;
    let gameInterval, timerInterval;
    let playerGender = '';
    let partnerLabel = '';
    let confettiParticles = [];

    function resizeCanvas() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function selectGender(gender) {
      playerGender = gender;
      partnerLabel = gender === 'male' ? 'your Queen 👸' : 'your King 🤴';
      genderScreen.style.display = 'none';
      instructionScreen.style.display = 'block';
    }

    function randomPosition(max) {
      return Math.floor(Math.random() * max);
    }

    function createHeart() {
      const heart = document.createElement('div');
      const isBroken = Math.random() < 0.2;
      heart.classList.add(isBroken ? 'broken-heart' : 'heart');
      heart.innerHTML = isBroken ? '💔' : '❤️';
      heart.style.left = randomPosition(game.offsetWidth - 30) + 'px';
      heart.style.top = randomPosition(game.offsetHeight - 30) + 'px';
      
      heart.addEventListener('click', () => {
        score += isBroken ? -1 : 1;
        if (score < 0) score = 0;
        scoreDisplay.textContent = 'Score: ' + score;
        heart.remove();
      });

      game.appendChild(heart);
      setTimeout(() => heart.remove(), 3000);
    }

    function startGame() {
      instructionScreen.style.display = 'none';
      gameScreen.style.display = 'block';
      score = 0;
      timeLeft = 30;
      scoreDisplay.textContent = 'Score: 0';
      timerDisplay.textContent = 'Time Left: 30';
      game.innerHTML = '';

      gameInterval = setInterval(createHeart, 600);
      timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = 'Time Left: ' + timeLeft;
        if (timeLeft <= 0) {
          clearInterval(gameInterval);
          clearInterval(timerInterval);
          endGame();
        }
      }, 1000);
    }

    function endGame() {
      gameScreen.style.display = 'none';
      resultScreen.style.display = 'block';

      let message = '';
      if (score <= 5) message = 'Needs Work 😅';
      else if (score <= 10) message = 'Getting There 💌';
      else if (score <= 15) message = 'Sweetheart 💕';
      else if (score <= 29) message = 'Hopeless Romantic 🌹';
      else message = 'TRUE LOVE 💍💖';

      heartTotal.textContent = `You caught ${score} hearts!`;
      loveMessage.textContent = `Your love for ${partnerLabel} is: ${message}`;

      if (score >= 15) triggerConfetti();
    }

    // Confetti burst
    function triggerConfetti() {
      for (let i = 0; i < 150; i++) {
        confettiParticles.push({
          x: Math.random() * confettiCanvas.width,
          y: Math.random() * confettiCanvas.height - 50,
          r: Math.random() * 6 + 4,
          d: Math.random() * 10 + 2,
          color: `hsl(${Math.random() * 360}, 100%, 70%)`,
          tilt: Math.random() * 10 - 5
        });
      }

      function draw() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        for (let i = 0; i < confettiParticles.length; i++) {
          const p = confettiParticles[i];
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
          ctx.fill();
          p.y += p.d;
          p.x += Math.sin(p.tilt);
          if (p.y > confettiCanvas.height) p.y = -10;
        }
        requestAnimationFrame(draw);
      }
      draw();
    }
