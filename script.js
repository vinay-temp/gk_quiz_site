const category_select = document.getElementById("category-select");

function createPage(data) {
  category_select.innerHTML = "";
  let totalSize = 0;
  let allSelected = false;

  Object.keys(data).forEach((topic) => {
    let topic_div = document.createElement("div");
    topic_div.className = "topic";

    let subtopics = document.createElement("div");
    subtopics.className = "subtopics";

    Object.keys(data[topic]).forEach((subtopic) => {
      let subtopic_div = document.createElement("div");
      subtopic_div.className = "subtopic";

      subtopic_div.id = `${topic}-${subtopic}`;

      let name = subtopic[0].toUpperCase() + subtopic.slice(1);
      let size = data[topic][subtopic].length;
      totalSize += size;

      subtopic_div.innerHTML = `<input type="checkbox" /> ${name} (${size})`;
      subtopics.appendChild(subtopic_div);

      subtopic_div.addEventListener("click", () => {
        subtopic_div.getElementsByTagName("input")[0].checked =
          !subtopic_div.getElementsByTagName("input")[0].checked;
      });
    });

    topic_div.innerHTML = `<h6>${topic[0].toUpperCase() + topic.slice(1)}</h6>`;
    topic_div.appendChild(subtopics);
    category_select.appendChild(topic_div);
  });

  let select_all = document.getElementById("select-all");

  select_all.innerHTML = `<input type="checkbox" /> Select all (${totalSize})`;
  select_all.addEventListener("click", () => {
    let checks = document.getElementsByTagName("input");
    for (let i = 0; i < checks.length; i++) checks[i].checked = !allSelected;
    allSelected = !allSelected;
  });

  document.getElementById("start").addEventListener("click", () => {
    let selected_data = {};

    document.querySelectorAll(".subtopic").forEach((subtopic_div) => {
      if (subtopic_div.getElementsByTagName("input")[0].checked) {
        let [topic, subtopic] = subtopic_div.id.split("-");
        if (!selected_data[topic]) selected_data[topic] = [];
        selected_data[topic].push(subtopic);
      }
    });

    let question_set = [];
    Object.keys(selected_data).forEach((topic) => {
      selected_data[topic].forEach((subtopic) => {
        question_set.push(...data[topic][subtopic]);
      });
    });

    if (question_set.length == 0) return;

    document.getElementById("start-page").classList.add("hidden");
    document.getElementById("quiz-container").classList.remove("hidden");
    STARTQUIZ(question_set);
  });
}

fetch("https://gk-server.glitch.me/get_database")
  .then((res) => res.json()) // Parse the JSON response
  .then((res) => {
    let data = JSON.parse(JSON.stringify(res)).database;
    createPage(data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

//
//!
// Quiz Code
//!
//

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

console.log("Version: 3");
