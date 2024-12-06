<template>
  <div class="new-year-container">
    <canvas ref="fireworksCanvas" class="fireworks"></canvas>
    <div class="content" v-if="!isNewYear">
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
      <p class="message">{{ countdownMessage }}</p>
    </div>
    <div class="content celebration" v-else>
      <h1 class="title celebration-title">新年快乐 2025！</h1>
      <div class="celebration-message">
        <p class="fade-in">愿新的一年带给你：</p>
        <ul>
          <li class="slide-in">无限的快乐和幸福</li>
          <li class="slide-in">事业的蒸蒸日上</li>
          <li class="slide-in">健康的身心</li>
          <li class="slide-in">美满的家庭生活</li>
        </ul>
        <p class="fade-in delayed">愿你的每一天都充满阳光，每一步都充满希望！</p>
      </div>
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
const countdownMessage = ref('新的一年，新的开始，愿你的未来如烟花绽放，璀璨夺目！');
const isNewYear = ref(false);

const targetDate = new Date('2025-01-01T00:00:00').getTime();

const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    clearInterval(countdownTimer);
    days.value = hours.value = minutes.value = seconds.value = 0;
    isNewYear.value = true;
  } else {
    days.value = Math.floor(distance / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((distance % (1000 * 60)) / 1000);
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

  class Particle {
    x: number;
    y: number;
    color: string;
    velocity: { x: number; y: number };
    alpha: number;

    constructor(x: number, y: number, color: string) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.velocity = {
        x: Math.random() * 3 - 1.5,
        y: Math.random() * 3 - 1.5
      };
      this.alpha = 1;
    }

    draw() {
      if (!ctx) return;
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= 0.01;
    }
  }

  class Firework {
    x: number;
    y: number;
    color: string;
    particles: Particle[];

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.particles = [];

      this.explode();
    }

    explode() {
      for (let i = 0; i < 100; i++) {
        this.particles.push(new Particle(this.x, this.y, this.color));
      }
    }

    update() {
      this.particles = this.particles.filter(particle => particle.alpha > 0);
      this.particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
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

    fireworks = fireworks.filter(firework => firework.particles.length > 0);
    fireworks.forEach(firework => firework.update());

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
  display: flex;
  justify-content: center;
  align-items: center;
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
  text-align: center;
  padding: 1rem;
  max-width: 100%;
  box-sizing: border-box;
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

.celebration-title {
  font-size: 4rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  animation: titlePop 1.5s ease-out;
}

@keyframes titlePop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.celebration-message {
  font-size: 1.5rem;
  line-height: 1.6;
  max-width: 800px;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
}

.celebration-message ul {
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
}

.celebration-message li {
  margin-bottom: 0.5rem;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 1.5s ease-out forwards;
}

.slide-in {
  opacity: 0;
  transform: translateX(-50px);
  animation: slideIn 1s ease-out forwards;
}

.delayed {
  animation-delay: 1.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}

.celebration-message li:nth-child(1) { animation-delay: 0.2s; }
.celebration-message li:nth-child(2) { animation-delay: 0.4s; }
.celebration-message li:nth-child(3) { animation-delay: 0.6s; }
.celebration-message li:nth-child(4) { animation-delay: 0.8s; }

@media (max-width: 768px) {
  .title, .celebration-title {
    font-size: 2.5rem;
  }

  .countdown {
    flex-wrap: wrap;
    justify-content: center;
  }

  .time-block {
    margin: 0.5rem;
  }

  .time {
    font-size: 2.5rem;
  }

  .label {
    font-size: 0.8rem;
  }

  .message, .celebration-message {
    font-size: 1.2rem;
    margin-top: 1.5rem;
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .title, .celebration-title {
    font-size: 2rem;
  }

  .time {
    font-size: 2rem;
  }

  .message, .celebration-message {
    font-size: 1rem;
  }
}
</style>

