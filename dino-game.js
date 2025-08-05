// Simple Dinosaur Game - Chrome offline game inspired
class DinosaurGame {
    constructor(canvasId, scoreId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById(scoreId);
        this.highScoreElement = document.getElementById('highScore');
        
        // Game state
        this.gameRunning = false;
        this.gameOver = false;
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.gameSpeed = 3;
        this.frameCount = 0;
        
        // Dinosaur properties
        this.dino = {
            x: 50,
            y: 90, // Start on ground (groundY - height = 130 - 40 = 90)
            width: 40,
            height: 40,
            dy: 0,
            jumpPower: 3,
            grounded: true,
            color: '#535353',
            animationFrame: 0 // For running animation
        };
        
        // Obstacles
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.obstacleInterval = 120;
        
        // Clouds
        this.clouds = [];
        this.initClouds();
        
        // Ground
        this.groundY = 130;
        
        // Load tank image
        this.tankImage = new Image();
        this.tankImage.src = 'google-example/bw_tank-removebg-preview.png';
        this.tankImageLoaded = false;
        this.tankImage.onload = () => {
            this.tankImageLoaded = true;
        };
        
        // Load dinosaur image
        this.dinoImage = new Image();
        this.dinoImage.src = 'google-example/google-chrome-guess-the-font-dinosaur-game-nvidia-shield-chrome-2624772108-removebg-preview.png';
        this.dinoImageLoaded = false;
        this.dinoImage.onload = () => {
            this.dinoImageLoaded = true;
        };
        
        this.init();
        this.updateHighScoreDisplay();
    }
    
    loadHighScore() {
        try {
            return parseInt(localStorage.getItem('dinoHighScore') || '0');
        } catch (e) {
            return 0;
        }
    }
    
    saveHighScore() {
        try {
            localStorage.setItem('dinoHighScore', this.highScore.toString());
        } catch (e) {
            // Ignore storage errors
        }
    }
    
    init() {
        this.setupEventListeners();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleJump();
            }
        });
        
        // Mouse/touch controls
        this.canvas.addEventListener('click', () => {
            this.handleJump();
        });
    }
    
    handleJump() {
        if (!this.gameRunning && !this.gameOver) {
            this.startGame();
        } else if (this.gameRunning && this.dino.grounded) {
            this.dino.dy = -this.dino.jumpPower;
            this.dino.grounded = false;
        } else if (this.gameOver) {
            this.resetGame();
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameOver = false;
        this.score = 0;
        this.gameSpeed = 3;
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gameOver = false;
        this.score = 0;
        this.gameSpeed = 3;
        this.frameCount = 0;
        this.obstacles = [];
        this.dino.y = 90; // Reset to ground position
        this.dino.dy = 0;
        this.dino.grounded = true;
        this.dino.animationFrame = 0;
        this.initClouds();
    }
    
    initClouds() {
        this.clouds = [];
        // Add initial clouds
        for (let i = 0; i < 4; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: 20 + Math.random() * 40,
                width: 30 + Math.random() * 20,
                height: 15 + Math.random() * 10,
                speed: 0.5 + Math.random() * 0.5
            });
        }
    }
    
    updateDinosaur() {
        // Gravity
        if (!this.dino.grounded) {
            this.dino.dy += 0.08;
            this.dino.y += this.dino.dy;
        }
        
        // Ground collision
        if (this.dino.y >= this.groundY - this.dino.height) {
            this.dino.y = this.groundY - this.dino.height;
            this.dino.grounded = true;
            this.dino.dy = 0;
        }
        
        // Update running animation when on ground and game is running
        if (this.dino.grounded && this.gameRunning) {
            this.dino.animationFrame++;
        }
    }
    
    updateObstacles() {
        // Add new obstacles
        this.obstacleTimer++;
        if (this.obstacleTimer >= this.obstacleInterval) {
            this.obstacles.push({
                x: this.canvas.width,
                y: this.groundY - 35,
                width: 50,
                height: 40,
                color: '#535353'
            });
            this.obstacleTimer = 0;
            this.obstacleInterval = Math.random() * 50 + 80; // Random spacing
        }
        
        // Move obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.gameSpeed;
            
            // Remove off-screen obstacles
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    updateClouds() {
        // Move clouds
        for (let cloud of this.clouds) {
            cloud.x -= cloud.speed;
            
            // Reset clouds that go off screen
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.canvas.width + Math.random() * 100;
                cloud.y = 20 + Math.random() * 40;
            }
        }
    }
    
    checkCollisions() {
        for (let obstacle of this.obstacles) {
            // Calculate animation offset for collision detection
            let animationOffset = 0;
            if (this.dino.grounded && this.gameRunning) {
                animationOffset = Math.sin(this.dino.animationFrame * 0.15) * 1;
            }
            
            // Create smaller collision boxes with padding for more accurate detection
            const dinoCollisionPadding = 4;
            const obstacleCollisionPadding = 2;
            
            const dinoLeft = this.dino.x + dinoCollisionPadding;
            const dinoRight = this.dino.x + this.dino.width - dinoCollisionPadding;
            const dinoTop = this.dino.y + animationOffset + dinoCollisionPadding;
            const dinoBottom = this.dino.y + animationOffset + this.dino.height - dinoCollisionPadding;
            
            const obstacleLeft = obstacle.x + obstacleCollisionPadding;
            const obstacleRight = obstacle.x + obstacle.width - obstacleCollisionPadding;
            const obstacleTop = obstacle.y + obstacleCollisionPadding;
            const obstacleBottom = obstacle.y + obstacle.height - obstacleCollisionPadding;
            
            if (dinoLeft < obstacleRight &&
                dinoRight > obstacleLeft &&
                dinoTop < obstacleBottom &&
                dinoBottom > obstacleTop) {
                this.gameOver = true;
                this.gameRunning = false;
                
                // Update high score if current score is higher
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    this.saveHighScore();
                    this.updateHighScoreDisplay();
                }
            }
        }
    }
    
    render() {
        // Clear canvas with white background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds
        this.ctx.fillStyle = '#f0f0f0';
        for (let cloud of this.clouds) {
            this.drawCloud(cloud.x, cloud.y, cloud.width, cloud.height);
        }
        
        // Draw ground line
        this.ctx.strokeStyle = '#afafaf';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.groundY);
        this.ctx.lineTo(this.canvas.width, this.groundY);
        this.ctx.stroke();
        
        // Draw dinosaur
        if (this.dinoImageLoaded) {
            // Disable image smoothing for crisp pixel art
            this.ctx.imageSmoothingEnabled = false;
            
            // Calculate running animation offset (bobbing up and down)
            let animationOffset = 0;
            if (this.dino.grounded && this.gameRunning) {
                // Create a bobbing effect - oscillate between 0 and 2 pixels
                animationOffset = Math.sin(this.dino.animationFrame * 0.15) * 1;
            }
            
            this.ctx.drawImage(this.dinoImage, this.dino.x, this.dino.y + animationOffset, this.dino.width, this.dino.height);
            this.ctx.imageSmoothingEnabled = true; // Re-enable for other drawing
        } else {
            // Fallback to gray square if image not loaded
            this.ctx.fillStyle = this.dino.color;
            this.ctx.fillRect(this.dino.x, this.dino.y, this.dino.width, this.dino.height);
        }
        
        // Draw obstacles (tanks)
        for (let obstacle of this.obstacles) {
            if (this.tankImageLoaded) {
                // Disable image smoothing for crisp pixel art
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.drawImage(this.tankImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                this.ctx.imageSmoothingEnabled = true; // Re-enable for other drawing
            } else {
                // Fallback to drawn tank if image not loaded
                this.drawTank(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
        }
        
        // Draw game over text
        if (this.gameOver) {
            // Disable font smoothing for pixelated text
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.fillStyle = '#202124';
            this.ctx.font = 'bold 24px monospace';
            this.ctx.textAlign = 'center';
            
            // Draw pixelated "GAME OVER" text
            this.drawPixelText('GAME OVER', this.canvas.width / 2, 50);
            
            this.ctx.font = '12px monospace';
            this.ctx.fillText('Click to restart', this.canvas.width / 2, 75);
            this.ctx.imageSmoothingEnabled = true;
        }
        
        // Draw start instruction
        if (!this.gameRunning && !this.gameOver) {
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.fillStyle = '#5f6368';
            this.ctx.textAlign = 'center';
            
            // Draw pixelated start text
            this.drawSmallPixelText('PRESS SPACE TO START', this.canvas.width / 2, 50);
            this.ctx.imageSmoothingEnabled = true;
        }
        
        // Draw pixelated scores
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.fillStyle = '#535353';
        
        // Draw scores on same line (top right)
        const highScoreText = `HI ${this.highScore.toString().padStart(5, '0')}`;
        this.drawSmallPixelText(highScoreText, this.canvas.width - 120, 15);
        
        // Draw current score next to high score (if game is running or over)
        if (this.gameRunning || this.gameOver) {
            const currentScoreText = this.score.toString().padStart(5, '0');
            this.drawSmallPixelText(currentScoreText, this.canvas.width - 40, 15);
        }
        
        this.ctx.imageSmoothingEnabled = true;
    }
    
    drawCloud(x, y, width, height) {
        this.ctx.beginPath();
        // Draw cloud as overlapping circles
        const radius = height / 2;
        this.ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
        this.ctx.arc(x + width - radius, y + radius, radius, 0, Math.PI * 2);
        this.ctx.arc(x + width / 2, y + radius * 0.7, radius * 0.8, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawTank(x, y, width, height) {
        // Define colors for better pixel art
        const darkGray = '#3a3a3a';
        const mediumGray = '#535353'; 
        const lightGray = '#6a6a6a';
        const black = '#2a2a2a';
        
        // Tank treads/tracks (bottom)
        this.ctx.fillStyle = black;
        this.ctx.fillRect(x, y + height - 3, width, 3);
        this.ctx.fillStyle = darkGray;
        this.ctx.fillRect(x + 1, y + height - 2, width - 2, 1);
        
        // Tank hull/body
        this.ctx.fillStyle = mediumGray;
        this.ctx.fillRect(x + 2, y + 6, width - 4, height - 9);
        
        // Hull highlights
        this.ctx.fillStyle = lightGray;
        this.ctx.fillRect(x + 2, y + 6, width - 4, 1); // top highlight
        this.ctx.fillRect(x + 2, y + 6, 1, height - 9); // left highlight
        
        // Hull shadows
        this.ctx.fillStyle = darkGray;
        this.ctx.fillRect(x + width - 3, y + 7, 1, height - 10); // right shadow
        this.ctx.fillRect(x + 3, y + height - 4, width - 6, 1); // bottom shadow
        
        // Turret
        this.ctx.fillStyle = mediumGray;
        this.ctx.fillRect(x + 7, y + 2, width - 14, 8);
        
        // Turret highlights
        this.ctx.fillStyle = lightGray;
        this.ctx.fillRect(x + 7, y + 2, width - 14, 1); // top highlight
        this.ctx.fillRect(x + 7, y + 2, 1, 8); // left highlight
        
        // Turret shadows
        this.ctx.fillStyle = darkGray;
        this.ctx.fillRect(x + width - 8, y + 3, 1, 7); // right shadow
        this.ctx.fillRect(x + 8, y + 9, width - 16, 1); // bottom shadow
        
        // Cannon barrel
        this.ctx.fillStyle = darkGray;
        this.ctx.fillRect(x + width - 6, y + 5, 6, 2);
        this.ctx.fillStyle = lightGray;
        this.ctx.fillRect(x + width - 6, y + 5, 6, 1); // cannon highlight
        
        // Tank details (hatches, viewports, etc.)
        this.ctx.fillStyle = black;
        this.ctx.fillRect(x + 5, y + 8, 2, 2); // viewport
        this.ctx.fillRect(x + 9, y + 4, 2, 2); // turret hatch
        this.ctx.fillRect(x + width - 10, y + 8, 2, 2); // side detail
        
        // Road wheels (tank wheels)
        this.ctx.fillStyle = black;
        this.ctx.fillRect(x + 3, y + height - 5, 2, 2);
        this.ctx.fillRect(x + 7, y + height - 5, 2, 2);
        this.ctx.fillRect(x + 13, y + height - 5, 2, 2);
        this.ctx.fillRect(x + 17, y + height - 5, 2, 2);
    }
    
    drawPixelText(text, x, y) {
        this.renderPixelText(text, x, y, PIXEL_FONTS.large);
    }
    
    drawSmallPixelText(text, x, y) {
        this.renderPixelText(text, x, y, PIXEL_FONTS.small);
    }
    
    renderPixelText(text, x, y, font) {
        const { pixelSize, letterSpacing, letters } = font;
        let startX = x - ((text.length * letterSpacing) / 2);
        
        for (let i = 0; i < text.length; i++) {
            const letter = letters[text[i]];
            if (letter) {
                for (let row = 0; row < letter.length; row++) {
                    for (let col = 0; col < letter[row].length; col++) {
                        if (letter[row][col]) {
                            this.ctx.fillRect(
                                startX + (i * letterSpacing) + (col * pixelSize),
                                y - (font === PIXEL_FONTS.large ? 15 : 10) + (row * pixelSize),
                                pixelSize,
                                pixelSize
                            );
                        }
                    }
                }
            }
        }
    }
    
    updateScore() {
        // Score is now rendered directly on canvas in render() method
        // No longer need to update HTML elements
    }
    
    updateHighScoreDisplay() {
        // High score is now rendered directly on canvas in render() method
        // No longer need to update HTML elements
    }
    
    gameLoop() {
        if (this.gameRunning) {
            this.updateDinosaur();
            this.updateObstacles();
            this.checkCollisions();
            
            // Update score based on time alive (every 6 frames = ~1 point per 0.1 second)
            this.frameCount++;
            if (this.frameCount % 6 === 0) {
                this.score++;
                
                // Increase speed every 100 points
                if (this.score % 100 === 0) {
                    this.gameSpeed += 0.5;
                }
            }
            
            this.updateScore();
        }
        
        // Always update clouds for animation
        this.updateClouds();
        
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when DOM is loaded
function initDinosaurGame() {
    const game = new DinosaurGame('gameCanvas', 'gameScore');
}