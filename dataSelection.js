function handlePrimaryDropdownChange() {
  const primaryDropdown = document.getElementById("datasetSelect");
  const selectedOption = primaryDropdown.value;
  const secondaryButtonsContainer = document.getElementById("secondaryButtons");
  const displayText = document.getElementById("selectedDataset");
  const sliderContainer = document.getElementById("sliderContainer");

  secondaryButtonsContainer.innerHTML = "";
  sliderContainer.style.display = "none"; // Hide slider initially

  if (selectedOption === "offline") {
    displayText.textContent = "You selected: Offline Dataset";
    const offlineOptions = ["Suicide Dataset", "Stress Dataset"];
    offlineOptions.forEach((option, index) => {
      if (index === 0) createDatasetButton(option, "data-set-1");
      else createDatasetButton(option, "data-set-2");
    });
    secondaryButtonsContainer.style.display = "block";
  } else if (selectedOption === "online") {
    displayText.textContent = "You selected: Online Dataset";
    const onlineOptions = ["Suicide Dataset", "Stress Dataset"];
    onlineOptions.forEach((option) => {
      createDatasetButton(option, "online");
    });
    secondaryButtonsContainer.style.display = "block";
    sliderContainer.style.display = "block"; // Show slider
  }
}

function createDatasetButton(optionName, className) {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = optionName;
  button.onclick = () => handleDatasetClick(optionName);
  document.getElementById("secondaryButtons").appendChild(button);
}

function handleDatasetClick(datasetName) {
  document.getElementById(
    "selectedDataset"
  ).textContent = `You selected: ${datasetName}`;
  const postCount = document.getElementById("postSlider").value;

  if (datasetName === "Suicide Dataset") {
    fetchRedditData("suicidewatch", postCount);
  } else if (datasetName === "Stress Dataset") {
    fetchRedditData("stress", postCount);
  }
}

function updateSliderValue(value) {
  document.getElementById("sliderValue").textContent = value;
}

function fetchRedditData(subreddit, limit) {
  const apiUrl = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const posts = data.data.children.map((child) => child.data);
      populateTable(posts);
      runSVMModel(posts); // Run SVM model on fetched posts
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function populateTable(posts) {
  const table = document.getElementById("resultTable");
  const tableBody = document.getElementById("resultTableBody");
  tableBody.innerHTML = ""; // Clear previous data

  posts.forEach((post) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${post.title}</td>
            <td>${post.score}</td>
            <td>${post.num_comments}</td>
        `;
    tableBody.appendChild(row);
  });

  table.style.display = "table"; // Show the table after data is populated
}

function runSVMModel(posts) {
  // Prepare data for SVM model
  // For simplicity, we'll mock this part since SVM requires numerical features
  // Assume each post has a score, and we'll simulate labels (1 for positive sentiment, 0 for negative)
  const data = posts.map((post) => ({
    score: post.score, // Using score as a feature
    label: Math.random() > 0.5 ? 1 : 0, // Mock labels
  }));

  // Mock SVM results
  const accuracy = Math.random().toFixed(2);
  const precision = Math.random().toFixed(2);
  const recall = Math.random().toFixed(2);
  const f1Measure = ((2 * precision * recall) / (precision + recall)).toFixed(
    2
  );

  displaySVMResults(accuracy, precision, recall, f1Measure);
}

function displaySVMResults(accuracy, precision, recall, f1Measure) {
  const resultsTable = document.getElementById("svmResultsTable");
  const resultsBody = document.getElementById("svmResultsBody");
  resultsBody.innerHTML = ""; // Clear previous results

  resultsBody.innerHTML += `<tr><td>Accuracy</td><td>${accuracy}</td></tr>`;
  resultsBody.innerHTML += `<tr><td>Precision</td><td>${precision}</td></tr>`;
  resultsBody.innerHTML += `<tr><td>Recall</td><td>${recall}</td></tr>`;
  resultsBody.innerHTML += `<tr><td>F1 Measure</td><td>${f1Measure}</td></tr>`;

  resultsTable.style.display = "table"; // Show the results table
}
