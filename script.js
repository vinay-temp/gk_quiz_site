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

    window.open(
      `start.html?data=${encodeURIComponent(JSON.stringify(question_set))}`,
      "_blank"
    );
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

console.log("Version: 1");
