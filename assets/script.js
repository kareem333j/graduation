const giftContainer = document.querySelector('.gift-container');
const giftBox = document.getElementById('giftBox');
const giftText = document.getElementById('giftText');
const scene1 = document.getElementById('scene1');
const matrixCanvas = document.getElementById('matrixCanvas');
const countdownContainer = document.getElementById('countdownContainer');
const countdownElement = document.getElementById('countdown');
const scene2 = document.getElementById('scene2');
const typewriterText = document.getElementById('typewriterText');
const facultyText = document.getElementById('facultyText');
const universityText = document.getElementById('universityText');
const flowersContainer = document.getElementById('flowersContainer');
const scene3 = document.getElementById('scene3');
const audio = document.getElementById('celebrationAudio');

let opened = false;

// Matrix Effect Setup
const ctx = matrixCanvas.getContext('2d');
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
const fontSize = 16;
let columns = matrixCanvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
let matrixInterval;

// Typewriter Effect
const textToType = "أخيراً خلصنا 🎓";
let typeIndex = 0;
const typeTarget = document.getElementById('typeTarget');

function typeWriter() {
    if (typeIndex < textToType.length) {
        typeTarget.textContent = textToType.substring(0, typeIndex + 1);
        typeIndex++;
        requestAnimationFrame(() => {
            setTimeout(typeWriter, 150); // Speed of typing
        });
    } else {
        // Show faculty and university
        setTimeout(() => {
            facultyText.classList.add('show-text');
            setTimeout(() => {
                universityText.classList.add('show-text');

                // End sequence after 1 second of showing the text
                setTimeout(endSequence, 1200);
            }, 700);
        }, 700);
    }
}

// Congrats Text Typewriter
const congratsTarget = document.getElementById('congratsTarget');
const congratsCursor = document.getElementById('congratsCursor');
const textToTypeCongrats = "ألف مبروك دفعة 2026 🎓";
let typeIndexCongrats = 0;

function typeWriterCongrats() {
    if (typeIndexCongrats === 0) {
        congratsCursor.classList.remove('hidden');
    }
    if (typeIndexCongrats < textToTypeCongrats.length) {
        congratsTarget.textContent = textToTypeCongrats.substring(0, typeIndexCongrats + 1);
        typeIndexCongrats++;
        requestAnimationFrame(() => {
            setTimeout(typeWriterCongrats, 150); // Speed of typing
        });
    } else {
        // Typing finished
    }
}

// Flower Animation
const items = ['assets/flower1.png', 'assets/flower2.png', 'assets/graduation cap 1.png', 'assets/graduation cap 2.png'];
const preloadedImages = [];

// Pre-load images to ensure perfectly smooth animation
items.forEach(src => {
    const img = new Image();
    img.src = src;
    preloadedImages.push(img);
});

function createParticle() {
    const randomImg = preloadedImages[Math.floor(Math.random() * preloadedImages.length)];
    const item = randomImg.cloneNode();
    item.className = 'particle';

    // Random direction for throwAtCamera
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 80 + 50;
    const tx = Math.cos(angle) * distance + 'vw';
    const ty = Math.sin(angle) * distance + 'vh';

    const endScale = Math.random() * 2.0 + 2.0; // Increased scale (2.0 to 4.0)
    const duration = Math.random() * 2.5 + 2.5;

    // Set variables and duration efficiently
    item.style.cssText = `--tx: ${tx}; --ty: ${ty}; --end-scale: ${endScale}; animation-duration: ${duration}s;`;

    flowersContainer.appendChild(item);

    // Remove particle after animation
    setTimeout(() => {
        item.remove();
    }, duration * 1000);
}

let flowerInterval;

function startFlowers() {
    flowerInterval = setInterval(createParticle, 400); // Throw every 400ms for perfect smoothness
}

function stopFlowers() {
    clearInterval(flowerInterval);
}

// Main Flow
giftContainer.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    // 1. Change box image and stop shaking
    giftBox.src = 'assets/gift-box-after.png';
    giftBox.classList.remove('shake');
    giftText.style.opacity = '0';
    giftContainer.style.cursor = 'default';

    // Play audio
    audio.play().catch(e => console.log("Audio play failed", e));

    // Wait a little bit to show the open box, then start transitions
    setTimeout(() => {
        // Start Matrix background
        matrixCanvas.style.opacity = '1';
        matrixInterval = setInterval(drawMatrix, 33);

        // Hide Scene 1, Show Countdown
        scene1.classList.remove('active');
        countdownContainer.classList.add('active');

        let count = 5;
        countdownElement.innerText = count;

        const countInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownElement.innerText = count;
                // Restart pulse animation
                countdownElement.style.animation = 'none';
                countdownElement.offsetHeight; /* trigger reflow */
                countdownElement.style.animation = 'pulse 1s infinite';
            } else {
                clearInterval(countInterval);

                // End Countdown, Stop Matrix
                countdownContainer.classList.remove('active');
                matrixCanvas.style.opacity = '0';
                clearInterval(matrixInterval);

                // Start Scene 2
                setTimeout(() => {
                    scene2.classList.add('active');
                    startFlowers();

                    // Wait a bit before typing
                    setTimeout(typeWriter, 1500);

                }, 500); // Wait for fade out
            }
        }, 1000); // 1 second per count

    }, 500); // show open box for 0.5 seconds
});

function endSequence() {
    scene2.classList.remove('active');

    // Fade out audio slowly
    let vol = audio.volume;
    const fadeOut = setInterval(() => {
        if (vol > 0.05) {
            vol -= 0.05;
            audio.volume = vol;
        } else {
            audio.pause();
            clearInterval(fadeOut);
        }
    }, 200);

    setTimeout(() => {
        scene3.classList.add('active');
        // Start typing congrats text 1 second after scene3 is active
        setTimeout(typeWriterCongrats, 1000);
        // Stop generating new particles after The End is fully visible
        setTimeout(stopFlowers, 3000);
    }, 500);
}

// Handle window resize for canvas
window.addEventListener('resize', () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    columns = matrixCanvas.width / fontSize;
    drops.length = 0;
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
});
