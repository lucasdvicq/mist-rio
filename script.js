document.getElementById("start-game-btn").addEventListener("click", function() {
  document.getElementById("intro-screen").style.display = "none"; // Oculta a tela de introdução
  document.getElementById("game-container").style.display = "block"; // Exibe a tela do jogo

  startGame(); // Inicia o jogo
});

let attempts = 0;
let timer = 30;
let intervalId;
let ringPosition = -1; // Posição do anel, inicialmente indefinida
let bombPositions = []; // Array para armazenar as posições das bombas
let gameOver = false; // Flag para verificar se o jogo terminou

function startGame() {
  const gameBoard = document.getElementById("game-board");
  const timerElement = document.getElementById("timer");
  const attemptsElement = document.getElementById("attempts");
  const messageElement = document.getElementById("message");

  // Limpar o conteúdo do jogo
  gameBoard.innerHTML = '';
  messageElement.innerHTML = '';

  attempts = 0; // Reiniciar tentativas
  timer = 30; // Reiniciar o tempo
  bombPositions = generateBombs(3); // Gerar 3 bombas aleatórias
  gameOver = false; // Reiniciar o status de jogo

  // Remover qualquer botão de reinício, se já existir
  const restartButton = document.getElementById("restart-btn");
  if (restartButton) {
      restartButton.remove(); // Remove o botão de reinício se ele já estiver na tela
  }

  // Gerar 36 quadrados
  for (let i = 0; i < 36; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => handleClick(cell, i)); // Adiciona o evento de clique
      gameBoard.appendChild(cell);
  }

  // Colocar o anel em um quadrado aleatório
  ringPosition = Math.floor(Math.random() * 36); // Posição aleatória para o anel

  // Iniciar o temporizador
  intervalId = setInterval(() => {
      if (!gameOver) {
          timer--;
          timerElement.textContent = timer;

          if (timer <= 0) {
              clearInterval(intervalId); // Para o temporizador quando o tempo acabar
              messageElement.textContent = "O tempo acabou! Você não encontrou o anel.";
              showRestartButton(); // Mostrar o botão de reinício
          }
      }
  }, 1000);
}

// Função para gerar 3 posições aleatórias para as bombas
function generateBombs(numBombs) {
  let bombs = [];
  while (bombs.length < numBombs) {
      const randPos = Math.floor(Math.random() * 36); // Gera uma posição aleatória
      // Garantir que a bomba não seja colocada na posição do anel e que as bombas sejam distribuídas
      if (!bombs.includes(randPos) && randPos !== ringPosition) {
          bombs.push(randPos); // Adiciona a bomba se não for na posição do anel ou repetida
      }
  }
  return bombs;
}

function handleClick(cell, index) {
  if (gameOver) return; // Impede qualquer ação após o fim do jogo

  attempts++;
  const attemptsElement = document.getElementById("attempts");

  // Verificar se clicou no anel
  if (index === ringPosition) {
      const ring = document.createElement("div");
      ring.classList.add("anel"); // Aqui colocamos o anel
      cell.appendChild(ring); // Coloca o anel na célula correta
      document.getElementById("message").textContent = "Parabéns, você venceu! Encontrou o anel!";
      
      // Destacar o quadrado onde o anel foi encontrado
      cell.style.backgroundColor = "#ff4c97"; // Cor de fundo destacada
      cell.style.border = "5px solid #ff69b4"; // Borda especial
      cell.style.boxShadow = "0 0 15px rgba(255, 105, 180, 0.8)"; // Efeito de brilho

      // Adicionar o botão para redirecionar
      const button = document.createElement("button");
      button.textContent = "Clique e tome a maior decisão da sua vida!";
      button.id = "final-btn";
      button.addEventListener("click", function() {
          window.location.href = "pedido_de_namoro.html"; // Redireciona para a página do pedido de namoro
      });

      document.getElementById("game-container").appendChild(button);

      gameOver = true; // Marcar o fim do jogo
      clearInterval(intervalId); // Para o temporizador quando encontrar o anel
  } else if (bombPositions.includes(index)) {
      // Se o jogador clicar em uma bomba
      const bombImage = document.createElement("img");
      bombImage.src = "https://e7.pngegg.com/pngimages/451/190/png-clipart-bomb-bomb.png"; // Imagem da bomba
      bombImage.classList.add("bomb-image"); // Adiciona uma classe para a imagem da bomba

      cell.appendChild(bombImage); // Coloca a imagem da bomba na célula
      cell.style.backgroundColor = "#fff"; // Remove a cor de fundo
      cell.style.boxShadow = "0 0 20px rgba(255, 0, 0, 0.8)"; // Efeito de sombra vermelha
      document.getElementById("message").textContent = "Você clicou em uma bomba! Jogo perdido!";
      gameOver = true; // Marcar o fim do jogo
      clearInterval(intervalId); // Para o temporizador quando a bomba for acionada
      showRestartButton(); // Mostrar o botão de reinício
  } else {
      // Marcar tentativa errada
      cell.classList.add("dica-falsa");
  }

  attemptsElement.textContent = attempts;

  if (attempts >= 36 && !gameOver) {
      document.getElementById("message").textContent = "Você clicou em todos os quadrados! Não conseguiu encontrar o anel.";
      gameOver = true; // Marcar o fim do jogo
      clearInterval(intervalId); // Para o temporizador ao clicar em todos os quadrados
      showRestartButton(); // Mostrar o botão de reinício
  }
}

// Função para mostrar o botão de reinício
function showRestartButton() {
  // Só mostrar o botão de reinício uma vez, quando o jogo terminar
  if (!document.getElementById("restart-btn")) {
      const restartButton = document.createElement("button");
      restartButton.textContent = "Reiniciar Jogo";
      restartButton.id = "restart-btn";
      restartButton.addEventListener("click", restartGame); // Quando clicado, reinicia o jogo

      document.getElementById("game-container").appendChild(restartButton); // Adiciona o botão ao contêiner do jogo
  }
}

// Função para reiniciar o jogo
function restartGame() {
  document.getElementById("message").textContent = ''; // Limpar mensagem
  startGame(); // Iniciar o jogo novamente
}

