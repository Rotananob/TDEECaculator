// script.js
// ធ្វើការរក្សា logic ដើម 100% — Mifflin-St Jeor + activity factor
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tdee-form');
  const tdeeValueEl = document.getElementById('tdee-value');
  const maintainCalEl = document.getElementById('maintain-cal');
  const loseCalEl = document.getElementById('lose-cal');
  const gainCalEl = document.getElementById('gain-cal');
  const goalSuggestionsEl = document.getElementById('goal-suggestions');
  const copyBtn = document.getElementById('copy-btn');
  const copyMsg = document.getElementById('copy-msg');

  // helper: animate number (smooth count)
  function animateNumber(el, start, end, duration = 700) {
    const range = end - start;
    const minTimer = 16;
    const stepTime = Math.max(Math.floor(duration / Math.abs(range || 1)), minTimer);
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.round(start + range * easeOutCubic(progress));
      el.textContent = value.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = end.toLocaleString();
      }
    }
    window.requestAnimationFrame(step);
  }
  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

  // store last shown TDEE to animate from
  let lastTdee = 0;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const gender = document.querySelector('input[name="gender"]:checked').value;
      const age = parseInt(document.getElementById('age').value, 10);
      const height = parseFloat(document.getElementById('height').value);
      const weight = parseFloat(document.getElementById('weight').value);
      const activityFactor = parseFloat(document.getElementById('activity').value);

      // basic validation (same behavior as original)
      if (isNaN(age) || isNaN(height) || isNaN(weight) || isNaN(activityFactor) || age <= 0 || height <= 0 || weight <= 0) {
        alert("សូមបញ្ចូលទិន្នន័យត្រឹមត្រូវ និងជ្រើសរើសកម្រិតសកម្មភាព។");
        tdeeValueEl.textContent = "កំហុស!";
        goalSuggestionsEl.style.display = 'none';
        return;
      }

      // BMR — Mifflin-St Jeor (exactly original logic)
      let bmr = 0;
      if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      }

      // TDEE
      const tdee = bmr * activityFactor;
      const roundedTdee = Math.round(tdee);

      // goals (same as original)
      const maintainCal = roundedTdee;
      const loseCal = Math.max(0, roundedTdee - 500);
      const gainCal = roundedTdee + 500;

      // animate number for TDEE
      animateNumber(tdeeValueEl, lastTdee, roundedTdee, 700);
      lastTdee = roundedTdee;

      // update goal values (no animation for simplicity, but shown with toLocaleString)
      maintainCalEl.textContent = maintainCal.toLocaleString() + " Cal";
      loseCalEl.textContent = loseCal.toLocaleString() + " Cal";
      gainCalEl.textContent = gainCal.toLocaleString() + " Cal";

      goalSuggestionsEl.style.display = 'block';
    });
  }

  // copy to clipboard (simple utility)
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const tdee = tdeeValueEl.textContent || '';
      const maintain = maintainCalEl.textContent || '';
      const lose = loseCalEl.textContent || '';
      const gain = gainCalEl.textContent || '';

      const text = `TDEE: ${tdee}\nរក្សា: ${maintain}\nសម្រក: ${lose}\nបង្កើន: ${gain}`;
      navigator.clipboard?.writeText(text).then(() => {
        copyMsg.style.display = 'inline-block';
        copyMsg.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
          copyMsg.style.display = 'none';
          copyMsg.setAttribute('aria-hidden', 'true');
        }, 1500);
      }).catch(() => {
        alert('មិនអាចចម្លងបាន — សូមសាកល្បងម្តងទៀត។');
      });
    });
  }
});
