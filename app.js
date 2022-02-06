// Will calculate random value, that will be used for calculating 'attackValue' in the Vue app.
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Creating the Vue app
const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null, // null = false
      logMessages: [],
    };
  },
  computed: {
    // Updating the CSS style of an 'healthbar__value' class with a computed method -> so HTML stays leaner
    monsterBarStyles() {
      // If 'monsterHealth' is below 0 -> width: 0%
      if (this.monsterHealth < 0) return { width: "0%" };
      return { width: this.monsterHealth + "%" };
    },

    playerBarStyles() {
      // If 'playerHealth' is below 0 -> width: 0%
      if (this.playerHealth < 0) return { width: "0%" };
      return { width: this.playerHealth + "%" };
    },
    // If the leftover number from modulus operator is 0, then this method will trigger
    // -> this ensures, that special attack can be used every 3rd round
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  methods: {
    attackMonster() {
      // Counter for rounds
      this.currentRound++;
      // Calculates random number between 5 and 12
      const attackValue = getRandomValue(5, 12);
      // Decreases the 'monsterHealth' by 'attackValue'
      this.monsterHealth = this.monsterHealth - attackValue;
      // Pass the new 'logMessage'
      this.addLogMessage("player", "attack", attackValue);
      // Once i attack the monster, the monster will strike back
      this.attackPlayer();
    },
    attackPlayer() {
      // Calculates random number between 8 and 15
      const attackValue = getRandomValue(8, 15);
      // Decreases the 'playerHealth' by 'attackValue'
      this.playerHealth -= attackValue;
      // Pass the new 'logMessage'
      this.addLogMessage("monster", "attack", attackValue);
    },
    // Special attack, that can be used once in 3 rounds
    specialAttackMonster() {
      // Counter for rounds
      this.currentRound++;
      // Calculates random number between 10 and 25
      const attackValue = getRandomValue(10, 25);
      // Decreases the 'playerHealth' by 'attackValue'
      this.monsterHealth -= attackValue;
      // Pass the new 'logMessage'
      this.addLogMessage("player", "special-attack", attackValue);
      // Once i attack the monster, the monster will strike back
      this.attackPlayer();
    },
    // Heals the player for random value between 8 and 20
    healPlayer() {
      // Counter for rounds
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      // Checks if the 'playerHealth' + 'healValue' does not exceed 100
      if (this.playerHealth + healValue > 100) {
        // if so -> set 'playerHealth' to 100
        this.playerHealth = 100;
      } else {
        // if not -> add the 'healValue' to the 'playerHealth'
        this.playerHealth += healValue;
      }
      // Pass the new 'logMessage'
      this.addLogMessage("player", "heal", healValue);
      // When player heals himself -> monster will attack him
      this.attackPlayer();
    },
    // Will reset the game settings
    resetGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.logMessages = [];
    },
    // Will surrender the player
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      // Adds new value to the beggining of arr 'logMessages'
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
  watch: {
    // Dynamically changing the 'winner' data property depending whos health is faster at 0
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // Draw
        this.winner = "draw";
      }
      if (value <= 0) {
        // Player lost
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // Draw
        this.winner = "draw";
      }
      if (value <= 0) {
        // Monster lost
        this.winner = "player";
      }
    },
  },
});

// Mounting the Vue app to the '#game' HTML block
app.mount("#game");
