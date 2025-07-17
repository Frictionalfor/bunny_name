
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const messageDialog = document.getElementById('messageDialog');
        const messageText = document.getElementById('messageText');
        const continueBtn = document.getElementById('continueBtn');
        const endingScreen = document.getElementById('endingScreen');
        const restartBtn = document.getElementById('restartBtn');
        const counter = document.getElementById('counter');
        
        // Game state
        let gameState = {
            player: { x: 400, y: 300, size: 24, hopAnimation: 0 },
            carrots: [],
            collected: 0,
            totalCarrots: 5,
            showingMessage: false
        };
        
        // Motivational messages
        const messages = [
            "You are doing better than you think. 🌟",
            "It's okay to rest. You're still growing. 🌱",
            "Even stars need darkness to shine. ✨",
            "You are not alone. 🤗",
            "Your feelings are valid and important. 💙",
            "Progress isn't always visible, but it's happening. 🌿",
            "You are worthy of love and kindness. 💕",
            "It's okay to not be okay sometimes. 🌙",
            "You have survived 100% of your worst days. 💪",
            "Small steps are still steps forward. 👣",
            "You are braver than you believe. 🦋",
            "Your story isn't over yet. 📖",
            "You bring light to the world. 🕯️",
            "Healing isn't linear, and that's okay. 🌈",
            "You are enough, exactly as you are. 🌻",
            "Tomorrow is a new chance to try again. 🌅",
            "Your mental health matters. 💚",
            "You are not broken, you are healing. 🌸",
            "Every small victory counts. 🎉",
            "You deserve patience from yourself. 🌊",
            "Your sensitivity is a strength. 🌺",
            "You are allowed to take up space. 🌍",
            "Your dreams are worth pursuing. 🌠",
            "You have the power to create change. ⚡",
            "Your past doesn't define your future. 🔮",
            "You are learning and growing every day. 📚",
            "Your heart is resilient. ❤️",
            "You deserve to be proud of yourself. 🏆",
            "Your voice matters. 📢",
            "You are creating a beautiful life. 🎨",
            "Peace is possible for you. 🕊️",
            "You are not your thoughts. 🧠",
            "Your journey is unique and valuable. 🗺️",
            "You have everything you need within you. 💎",
            "Your kindness makes a difference. 🌟",
            "You are deserving of good things. 🎁",
            "Your struggles are making you stronger. 🌳",
            "You are allowed to feel proud. 🌞",
            "Your potential is limitless. 🚀",
            "You are writing your own story. ✍️",
            "Your courage inspires others. 🔥",
            "You are part of something bigger. 🌌",
            "Your existence has meaning. 🌍",
            "You are loved more than you know. 💝",
            "Your future self will thank you. 🙏",
            "You are a work of art in progress. 🎭",
            "Your happiness matters. 😊",
            "You are exactly where you need to be. 🧭",
            "Your light shines brightest in darkness. 💡",
            "You are home to yourself. 🏠"
        ];
        
        // Input handling
        const keys = {};
        
        document.addEventListener('keydown', (e) => {
            keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            keys[e.key.toLowerCase()] = false;
        });
        
        // Initialize game
        function initGame() {
            gameState.player = { x: 400, y: 300, size: 24, hopAnimation: 0 };
            gameState.carrots = [];
            gameState.collected = 0;
            gameState.showingMessage = false;
            counter.textContent = '0';
            
            // Generate random carrot positions
            for (let i = 0; i < gameState.totalCarrots; i++) {
                let x, y;
                do {
                    x = Math.random() * (canvas.width - 60) + 30;
                    y = Math.random() * (canvas.height - 60) + 30;
                } while (Math.abs(x - gameState.player.x) < 100 && Math.abs(y - gameState.player.y) < 100);
                
                gameState.carrots.push({
                    x: x,
                    y: y,
                    size: 16,
                    collected: false,
                    sway: Math.random() * Math.PI * 2,
                    message: messages[Math.floor(Math.random() * messages.length)]
                });
            }
        }
        
        // Update game logic
        function update() {
            if (gameState.showingMessage) return;
            
            // Player movement with hop animation
            const speed = 3;
            let moving = false;
            
            if (keys['w'] || keys['arrowup']) {
                gameState.player.y = Math.max(gameState.player.size/2, gameState.player.y - speed);
                moving = true;
            }
            if (keys['s'] || keys['arrowdown']) {
                gameState.player.y = Math.min(canvas.height - gameState.player.size/2, gameState.player.y + speed);
                moving = true;
            }
            if (keys['a'] || keys['arrowleft']) {
                gameState.player.x = Math.max(gameState.player.size/2, gameState.player.x - speed);
                moving = true;
            }
            if (keys['d'] || keys['arrowright']) {
                gameState.player.x = Math.min(canvas.width - gameState.player.size/2, gameState.player.x + speed);
                moving = true;
            }
            
            // Update hop animation
            if (moving) {
                gameState.player.hopAnimation += 0.3;
            } else {
                gameState.player.hopAnimation *= 0.9;
            }
            
            // Check collisions with carrots
            gameState.carrots.forEach(carrot => {
                if (!carrot.collected) {
                    carrot.sway += 0.05;
                    
                    const dx = gameState.player.x - carrot.x;
                    const dy = gameState.player.y - carrot.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < gameState.player.size/2 + carrot.size/2) {
                        carrot.collected = true;
                        gameState.collected++;
                        counter.textContent = gameState.collected;
                        showMessage(carrot.message);
                        createSparkles(carrot.x, carrot.y);
                    }
                }
            });
            
            // Check if all carrots collected
            if (gameState.collected === gameState.totalCarrots && !gameState.showingMessage) {
                setTimeout(() => {
                    endingScreen.style.display = 'flex';
                }, 1000);
            }
        }
        
        // Draw bunny
        function drawBunny(x, y) {
            const hopOffset = Math.sin(gameState.player.hopAnimation) * 3;
            const bunnyY = y + hopOffset;
            
            // Bunny body (light gray)
            ctx.fillStyle = '#E0E0E0';
            ctx.fillRect(x - 10, bunnyY - 8, 20, 16);
            
            // Bunny head (light gray)
            ctx.fillStyle = '#E0E0E0';
            ctx.fillRect(x - 8, bunnyY - 18, 16, 14);
            
            // Bunny ears (light gray)
            ctx.fillStyle = '#E0E0E0';
            ctx.fillRect(x - 6, bunnyY - 24, 4, 8);
            ctx.fillRect(x + 2, bunnyY - 24, 4, 8);
            
            // Inner ears (pink)
            ctx.fillStyle = '#FFB6C1';
            ctx.fillRect(x - 5, bunnyY - 22, 2, 4);
            ctx.fillRect(x + 3, bunnyY - 22, 2, 4);
            
            // Eyes (black)
            ctx.fillStyle = '#000';
            ctx.fillRect(x - 4, bunnyY - 15, 2, 2);
            ctx.fillRect(x + 2, bunnyY - 15, 2, 2);
            
            // Nose (pink)
            ctx.fillStyle = '#FFB6C1';
            ctx.fillRect(x - 1, bunnyY - 12, 2, 1);
            
            // Tail (white)
            ctx.fillStyle = '#FFF';
            ctx.fillRect(x - 12, bunnyY - 2, 4, 4);
            
            // Feet (darker gray)
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(x - 8, bunnyY + 6, 6, 4);
            ctx.fillRect(x + 2, bunnyY + 6, 6, 4);
        }
        
        // Draw carrot
        function drawCarrot(x, y, sway) {
            const swayOffset = Math.sin(sway) * 2;
            const carrotX = x + swayOffset;
            
            // Carrot body (orange)
            ctx.fillStyle = '#FF8C00';
            ctx.fillRect(carrotX - 6, y - 4, 12, 16);
            
            // Carrot tip (darker orange)
            ctx.fillStyle = '#FF6347';
            ctx.fillRect(carrotX - 3, y + 10, 6, 4);
            
            // Carrot leaves (green)
            ctx.fillStyle = '#228B22';
            ctx.fillRect(carrotX - 4, y - 12, 2, 8);
            ctx.fillRect(carrotX - 1, y - 14, 2, 10);
            ctx.fillRect(carrotX + 2, y - 12, 2, 8);
            
            // Carrot lines (darker orange)
            ctx.fillStyle = '#FF6347';
            ctx.fillRect(carrotX - 2, y - 2, 4, 1);
            ctx.fillRect(carrotX - 2, y + 2, 4, 1);
            ctx.fillRect(carrotX - 2, y + 6, 4, 1);
        }
        
        // Render game
        function render() {
            // Clear canvas with grass background
            ctx.fillStyle = '#7CFC00';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw grass texture
            ctx.fillStyle = '#90EE90';
            for (let i = 0; i < 200; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                ctx.fillRect(x, y, 1, 3);
            }
            
            // Draw flowers
            ctx.fillStyle = '#FFB6C1';
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                ctx.fillRect(x, y, 3, 3);
            }
            
            // Draw carrots
            gameState.carrots.forEach(carrot => {
                if (!carrot.collected) {
                    drawCarrot(carrot.x, carrot.y, carrot.sway);
                }
            });
            
            // Draw bunny
            drawBunny(gameState.player.x, gameState.player.y);
        }
        
        // Show message dialog
        function showMessage(message) {
            gameState.showingMessage = true;
            messageText.textContent = message;
            messageDialog.style.display = 'block';
        }
        
        // Create sparkle effect
        function createSparkles(x, y) {
            const gameContainer = document.getElementById('gameContainer');
            const rect = canvas.getBoundingClientRect();
            
            for (let i = 0; i < 8; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = (x - rect.left + Math.random() * 40 - 20) + 'px';
                sparkle.style.top = (y - rect.top + Math.random() * 40 - 20) + 'px';
                sparkle.style.animationDelay = Math.random() * 0.5 + 's';
                
                gameContainer.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 2000);
            }
        }
        
        // Event listeners
        continueBtn.addEventListener('click', () => {
            messageDialog.style.display = 'none';
            gameState.showingMessage = false;
        });
        
        restartBtn.addEventListener('click', () => {
            endingScreen.style.display = 'none';
            initGame();
        });
        
        // Game loop
        function gameLoop() {
            update();
            render();
            requestAnimationFrame(gameLoop);
        }
        
        // Start game
        initGame();
        gameLoop();

        // Mobile touch controls
const simulateKey = (key, isDown) => {
    keys[key] = isDown;
};

const touchMap = {
    up: 'w',
    down: 's',
    left: 'a',
    right: 'd'
};

Object.keys(touchMap).forEach(id => {
    const key = touchMap[id];
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            simulateKey(key, true);
        });
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            simulateKey(key, false);
        });
    }
});

// 🎉 Confetti trigger on game win
// Replace inside your update logic:
if (gameState.collected === gameState.totalCarrots && !gameState.showingMessage) {
    setTimeout(() => {
        endingScreen.style.display = 'flex';
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
        });
    }, 1000);
}

    