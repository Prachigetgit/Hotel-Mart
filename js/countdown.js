// Countdown Timer Configuration
const countdownConfig = {
  targetDate: (() => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 days from now
    date.setHours(23, 59, 59, 999);
    return date;
  })(),
  elements: {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  },
  interval: null,
};

// Format number to have leading zeros
function padNumber(number) {
  return String(number).padStart(2, "0");
}

// Calculate time remaining
function getTimeRemaining() {
  const now = new Date();
  const diff = countdownConfig.targetDate - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0,
    };
  }

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

// Update countdown display
function updateCountdown() {
  const time = getTimeRemaining();

  // Update each element with padded numbers
  countdownConfig.elements.days.textContent = padNumber(time.days);
  countdownConfig.elements.hours.textContent = padNumber(time.hours);
  countdownConfig.elements.minutes.textContent = padNumber(time.minutes);
  countdownConfig.elements.seconds.textContent = padNumber(time.seconds);

  // Stop countdown if finished
  if (time.total <= 0) {
    clearInterval(countdownConfig.interval);
    // Optional: Add any end-of-countdown effects here
  }
}

// Initialize countdown
function initCountdown() {
  // Clear any existing interval
  if (countdownConfig.interval) {
    clearInterval(countdownConfig.interval);
  }

  // Update immediately
  updateCountdown();

  // Set up interval for updates
  countdownConfig.interval = setInterval(updateCountdown, 1000);
}

// Start countdown when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Verify elements exist before starting
  const allElementsExist = Object.values(countdownConfig.elements).every(
    (element) => element !== null
  );

  if (allElementsExist) {
    initCountdown();
  } else {
    console.error("Countdown elements not found in the DOM");
  }
});
