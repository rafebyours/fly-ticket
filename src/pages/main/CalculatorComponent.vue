<!-- CalculatorComponent.vue -->
<template>
  <div class="calculator-container w-full rounded-lg">
    <div class="calculator">
      <div class="history-list" v-if="history.length">
        <div class="history-item" v-for="(item, index) in history" :key="index">
          {{ item }}
        </div>
      </div>
      <div class="clear-history-text" @click="clearHistory">Clear History</div>
      <div class="display-container">
        <div class="display">{{ display }}</div>
      </div>
      <div class="buttons">
        <button @click="updateDisplay('/')" class="operator-button">/</button>
        <button @click="updateDisplay('*')" class="operator-button">x</button>
        <button @click="clearDisplay" class="function-button">C</button>
        <button @click="deleteLastCharacter" class="function-button">⌫</button>
        <button @click="updateDisplay('7')">7</button>
        <button @click="updateDisplay('8')">8</button>
        <button @click="updateDisplay('9')">9</button>
        <button @click="updateDisplay('-')" class="operator-button">-</button>
        <button @click="updateDisplay('4')">4</button>
        <button @click="updateDisplay('5')">5</button>
        <button @click="updateDisplay('6')">6</button>
        <button @click="updateDisplay('+')" class="operator-button">+</button>
        <button @click="updateDisplay('1')">1</button>
        <button @click="updateDisplay('2')">2</button>
        <button @click="updateDisplay('3')">3</button>
        <button @click="addSquareRoot">√</button>
        <button @click="updateDisplay('.')">.</button>
        <button @click="updateDisplay('0')">0</button>
        <button @click="addSquare">x²</button>
        <button @click="calculate" class="equals-button">=</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalculatorComponent',
  data() {
    return {
      display: '0',
      history: []
    };
  },
  methods: {
    updateDisplay(value) {
      if (value === '*') value = 'x';
      else if (value === '/') value = '÷';

      if (this.display === '0') {
        this.display = value;
      } else {
        this.display += value;
      }
    },
    clearDisplay() {
      this.display = '0';
    },
    deleteLastCharacter() {
      if (this.display.length > 1) {
        this.display = this.display.slice(0, -1);
      } else {
        this.display = '0';
      }
    },
    calculate() {
      try {
        let expression = this.display
          .replace(/√(\d+(\.\d+)?)/g, (match, number) => `Math.sqrt(${number})`)
          .replace(/(\d+(\.\d+)?)²/g, (match, number) => `Math.pow(${number}, 2)`)
          .replace(/÷/g, '/')
          .replace(/x/g, '*');

        const result = eval(expression).toString();
        this.history.unshift(`${this.display} = ${result}`);
        if (this.history.length > 5) this.history.pop();
        this.display = result;
      } catch {
        this.display = 'Error';
      }
    },
    addSquare() {
      const lastNumber = this.display.match(/(\d+(\.\d+)?)$/);
      if (lastNumber) {
        this.display = this.display.slice(0, -lastNumber[0].length) + `${lastNumber[0]}²`;
      }
    },
    addSquareRoot() {
      const lastNumber = this.display.match(/(\d+(\.\d+)?)$/);
      if (lastNumber) {
        this.display = this.display.slice(0, -lastNumber[0].length) + `√${lastNumber[0]}`;
      }
    },
    clearHistory() {
      this.history = [];
    }
  }
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.calculator-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  background-color: #FFFFFF; /* Background putih untuk kontainer kalkulator */
}

.calculator {
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); /* Shadow ringan */
  background-color: #F9F9F9; /* Background abu terang untuk kalkulator */
}

.clear-history-text {
  color: #4CAF50; /* Hijau untuk teks 'Clear History' */
  text-align: right;
  padding: 10px;
  cursor: pointer;
  user-select: none;
}

.display-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.display {
  background-color: #E0E0E0; /* Warna abu terang untuk display */
  color: #333333; /* Teks gelap */
  font-size: 60px;
  padding: 20px;
  text-align: right;
  font-weight: bold;
  min-height: 80px;
  overflow-wrap: break-word;
  overflow-x: auto;
  white-space: pre-wrap;
}

.history-list {
  max-height: 50px;
  overflow-y: auto;
  background-color: #EFEFEF; /* Background abu muda untuk history */
  color: #555555; /* Teks abu */
  padding: 10px;
}

.history-item {
  margin-bottom: 5px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1px;
}

.buttons button {
  padding: 20px;
  font-size: 26px;
 /* Abu terang untuk tombol */
  color: #333333; /* Teks gelap */
  border: none;
  outline: #CCCCCC 1px solid;
  cursor: pointer;
  transition: background 0.3s;
}

.buttons button:hover {
  background-color: #CCCCCC; /* Abu sedikit lebih gelap saat hover */
}

.function-button {
  background-color: #B0BEC5; /* Biru abu-abu muda untuk tombol fungsi */
  color: #FFFFFF; /* Teks putih untuk fungsi tombol */
}

.operator-button {
  background-color: green-100; /* Hijau untuk tombol operator */
  color: #FFFFFF; /* Teks putih */
}

.operator-button:hover {
  background-color: #66BB6A; /* Warna hijau lebih terang saat hover */
}

.equals-button {
  background-color: #4CAF50; /* Warna hijau untuk tombol '=' */
  color: white;
}

.equals-button:hover {
  background-color: #66BB6A; /* Warna hijau lebih terang saat hover */
}

.buttons button:active {
  background-color: #B0BEC5; /* Warna aktif sedikit lebih gelap */
}


@media (max-width: 480px) {
  .display {
    font-size: 48px;
  }
  .buttons button {
    font-size: 22px;
    padding: 15px;
  }
}
</style>
