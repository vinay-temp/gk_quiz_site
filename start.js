const urlParams = new URLSearchParams(window.location.search);
let data = JSON.parse(decodeURIComponent(urlParams.get("data")));

STARTQUIZ(data);

var score, totalScore, seen, clickCount;

function STARTQUIZ(data) {
  score = 0;
  totalScore = data.length;
  seen = new Set();

  UpdateQuiz(data);
}

function UpdateQuiz(data) {
  document.getElementById("msg").style.color = "#121212";
  document.getElementById("score").innerHTML = `${score}/${totalScore}`;
  document.getElementById("tips").innerHTML = "";
  options.innerHTML = "";
  clickCount = 0;

  if (score == totalScore) {
    document.getElementById("question").innerHTML = "Completed";
    document.getElementById("score").innerHTML = `${score}/${totalScore}`;
    return;
  }

  let num = Math.floor(Math.random() * totalScore);
  while (seen.has(num)) {
    num = Math.floor(Math.random() * totalScore);
  }

  let q = data[num];
  document.getElementById("question").innerHTML = q.question;
  document.getElementById("tips").innerHTML = q.tips;
  document.getElementById("tips").classList.add("hidden");

  updateOptions(data, q, num);
}

function updateOptions(data, q, num) {
  let numbers = [1, 2, 3, 4];

  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // Swap elements
  }

  numbers.forEach((i) => {
    let option = document.createElement("button");

    option.className = "option";
    option.id = "option" + i;

    option.innerHTML = q[option.id];
    option.value = q[option.id];

    options.appendChild(option);
  });

  options.childNodes.forEach((option) => {
    option.addEventListener("click", () => {
      document.getElementById("tips").classList.remove("hidden");

      if (q.answer == option.value) {
        if (clickCount == 0) {
          score++;
          seen.add(num);
        }
        document.getElementById("score").innerHTML = `${score}/${totalScore}`;
        option.style.background = "green";
        clickCount++;

        if (clickCount == 2) {
          UpdateQuiz(data);
        } else {
          document.getElementById("msg").style.color = "white";

          options.childNodes.forEach((btn, i) => {
            btn.disabled = true;

            if (q.answer == btn.value) {
              btn.style.background = "green";
              btn.disabled = false;
            }
          });
        }
      } else {
        option.style.background = "#FF1A1A";
        clickCount++;
        document.getElementById("msg").style.color = "white";
        options.childNodes.forEach((btn, i) => {
          btn.disabled = true;

          if (q.answer == btn.value) {
            btn.style.background = "green";
            btn.disabled = false;
          }
        });
      }
    });
  });
}
