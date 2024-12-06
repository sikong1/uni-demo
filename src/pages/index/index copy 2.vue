<template>
  <div class="new-year-container">
    <canvas ref="fireworksCanvas" class="fireworks"></canvas>
    <div class="content">
      <h1 class="title">2025 新年倒计时</h1>
      <div class="countdown">
        <div class="time-block">
          <span class="time">{{ days }}</span>
          <span class="label">天</span>
        </div>
        <div class="time-block">
          <span class="time">{{ hours }}</span>
          <span class="label">时</span>
        </div>
        <div class="time-block">
          <span class="time">{{ minutes }}</span>
          <span class="label">分</span>
        </div>
        <div class="time-block">
          <span class="time">{{ seconds }}</span>
          <span class="label">秒</span>
        </div>
      </div>
      <p class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const fireworksCanvas = ref<HTMLCanvasElement | null>(null);
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const message = ref('新的一年，新的开始，愿你的未来如烟花绽放，璀璨夺目！');

const targetDate = new Date('2025-01-01T00:00:00').getTime();

const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  days.value = Math.floor(distance / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  seconds.value = Math.floor((distance % (1000 * 60)) / 1000);

  if (distance < 0) {
    clearInterval(countdownTimer);
    days.value = hours.value = minutes.value = seconds.value = 0;
    message.value = '新年快乐！愿你在2025年实现所有梦想！';
  }
};

let countdownTimer: number;

onMounted(() => {
  countdownTimer = setInterval(updateCountdown, 1000);
  initFireworks();
});

onUnmounted(() => {
  clearInterval(countdownTimer);
});

const initFireworks = () => {
  const canvas = fireworksCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Firework {
    x: number;
    y: number;
    color: string;
    velocity: { x: number; y: number };

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.velocity = {
        x: Math.random() * 6 - 3,
        y: Math.random() * 6 - 3
      };
    }

    draw() {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.velocity.y += 0.05;
    }
  }

  let fireworks: Firework[] = [];

  const animate = () => {
    if (!ctx || !canvas) return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) {
      fireworks.push(new Firework(Math.random() * canvas.width, canvas.height));
    }

    fireworks.forEach((firework, index) => {
      firework.draw();
      firework.update();
      if (firework.y > canvas.height) {
        fireworks.splice(index, 1);
      }
    });

    requestAnimationFrame(animate);
  };

  animate();
};
</script>

<style scoped>
.new-year-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffffff;
  font-family: 'Arial', sans-serif;
}

.fireworks {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.title {
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.countdown {
  display: flex;
  gap: 1rem;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time {
  font-size: 4rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.label {
  font-size: 1rem;
  text-transform: uppercase;
  margin-top: 0.5rem;
}

.message {
  font-size: 1.5rem;
  margin-top: 2rem;
  max-width: 600px;
  line-height: 1.6;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.new-year-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(white 1px, transparent 1px);
  background-size: 50px 50px;
  animation: twinkle 5s infinite;
}
</style>