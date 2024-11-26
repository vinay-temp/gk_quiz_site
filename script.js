const topic_container = document.getElementById("topics");
const go_back_btn = document.getElementById("goback");
const quiz_container = document.getElementById("quiz-container");
const options = document.getElementById("options");

function createTopics(data) {
  topic_container.innerHTML = "";
  go_back_btn.classList.add("hidden");

  Object.keys(data).forEach((topic) => {
    let btn = document.createElement("button");
    btn.className = "category";
    btn.value = topic;
    btn.innerHTML = topic;

    btn.addEventListener("click", () => {
      createSubtopics(data[topic]);
    });

    topic_container.appendChild(btn);
  });
}

function createSubtopics(data) {
  topic_container.innerHTML = "";
  go_back_btn.classList.remove("hidden");

  Object.keys(data).forEach((subtopic) => {
    let btn = document.createElement("button");
    btn.className = "category";
    btn.value = subtopic;
    btn.innerHTML = subtopic;

    btn.addEventListener("click", () => {
      document.getElementById("category-select").classList.add("hidden");
      quiz_container.classList.remove("hidden");
      STARTQUIZ(data[subtopic]);
    });

    topic_container.appendChild(btn);
  });
}

fetch("https://gk-server.glitch.me/get_database")
  .then((res) => res.json()) // Parse the JSON response
  .then((res) => {
    let data = JSON.parse(JSON.stringify(res)).database;

    createTopics(data);

    go_back_btn.addEventListener("click", () => {
      createTopics(data);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// !
// Quiz code starts here
// !

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
  for (let i = 1; i <= 4; i++) {
    let option = document.createElement("button");

    option.className = "option";
    option.id = "option" + i;

    option.innerHTML = q[option.id];
    option.value = q[option.id];

    options.appendChild(option);
  }

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
