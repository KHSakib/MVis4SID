let parsedData;

let selectedModel = [];
let currentRawData;
let selectData, currentSelectedDataset;

//============================== Slider
let sliderValue = 0;
let isScroll = false;
let mainDisplayResultData = "";
function updateValue(value) {
  document.getElementById("sliderValue").textContent = value;
  sliderValue = value;
  const dataDisplay = document.getElementById("specificDataDisplay");

  console.log("🚀 ~ updateValue ~ selectedModel:", selectedModel);
  currentRawData = makeData(selectedModel).trim();

  mainDisplayResultData = CurrentRawData(currentRawData); //mainDisplayResultData
  displayData2(mainDisplayResultData, dataDisplay);
}

// Initialize the slider value display
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("slider");
  // updateValue(slider.value);
});

//===============================End Slider============
document.addEventListener("DOMContentLoaded", function () {
  Load();
});

//===============================================================================

async function fetchAndDisplayData(product_id, num_reviews) {
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const apiUrl = encodeURIComponent(
    `https://serpapi.com/search.json?engine=google_play_product&product_id=${product_id}&store=apps&all_reviews=true&num=${num_reviews}&api_key=20b3d5bdd2922f1cb83efa7825287649880b87d556e7186d736770506e10566e`
  );
  const url = proxyUrl + apiUrl;

  try {
    const response = await fetch(url);
    const result = await response.json();
    const data = JSON.parse(result.contents);
    // console.log("🚀 ~ fetchAndDisplayData ~ data:", data);
    const reviews = data.reviews;
    console.log("🚀 ~ fetchAndDisplayData ~ reviews:", reviews);

    let table =
      "<table><tr><th>Title</th><th>Rating</th><th>Snippet</th><th>Snippet</th>Likes</tr>";
    reviews.forEach((review) => {
      table += `<tr>
                                <td>${review.title}</td>
                                <td>${review.rating}</td>
                                <td>${review.snippet}</td>
                                <td>${review.likes}</td>
                              </tr>`;
    });
    table += "</table>";

    document.getElementById("dataTable").innerHTML = table;
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("dataTable").innerText = "Error fetching data";
  }
}

// Example usage
// fetchAndDisplayData("com.facebook.katana", 100);

//======================================================================

function Load() {
  const checkboxes = document
    // .getElementsByClassName("container")[0]
    // .getElementsByClassName("sidebar")[0]
    .getElementsByClassName("dropdown")[0]
    .getElementsByClassName("model")[0]
    .getElementsByTagName("input");

  console.log("------------", checkboxes);

  for (const checkbox of checkboxes) {
    checkbox.addEventListener("change", function () {
      console.log("Checkbox change event triggered");
      if (this.checked) {
        const value = this.value;
        if (!selectedModel.includes(value)) selectedModel.push(value);
        if (selectedModel?.length > 0) {
          const dataDisplay = document.getElementById("specificDataDisplay");
          console.log("🚀 ~ selectedModel:", selectedModel);
          currentRawData = makeData(selectedModel).trim();
          //-===================================================================================================
          mainDisplayResultData = CurrentRawData(currentRawData);
          console.log(
            "🚀 ~ currentRawData:",
            mainDisplayResultData,
            sliderValue
          );
          //====================================================================================================
          // console.log("🚀 ~ currentRawData:", filteredData);
          // console.log(selectedModel, currentRawData);
          displayData2(mainDisplayResultData, dataDisplay);
        }
        // modelCheckboxSelected(this.id, this.value);
      } else {
        console.log(this.value);
        if (selectedModel.length > 0) {
          const dataDisplay = document.getElementById("specificDataDisplay");
          removeValueFromArray(selectedModel, this.value);
          currentRawData = makeData(selectedModel);
          mainDisplayResultData = CurrentRawData(currentRawData);
          displayData2(mainDisplayResultData, dataDisplay);
        }
        // modelCheckboxDeselected(this.id, this.value);
      }
    });
  }
  isScroll = false;
}

function CurrentRawData(currentRawData) {
  let rows = currentRawData.split("\n");

  // Extract the header row
  let header = rows[0];

  // Convert the rows into an array of objects
  let data = rows.slice(1).map((row) => {
    let [Model, Accuracy, Precision, Recall, Auc] = row.split(",");
    return {
      Model,
      Accuracy: parseFloat(Accuracy),
      Precision,
      Recall,
      Auc,
    };
  });

  // Filter out rows where Accuracy is less than 70
  let filteredData = data.filter((row) => row.Accuracy <= sliderValue);

  // Convert the filtered data back into a string
  let result = [
    header, // Add the header back
    ...filteredData.map(
      (row) =>
        `${row.Model},${row.Accuracy.toFixed(2)},${row.Precision},${
          row.Recall
        },${row.Auc}`
    ),
  ].join("\n");

  return result;
}

function handleFiles() {
  const fileInput = document.getElementById("csvFileInput");
  console.log(fileInput);
  const file = fileInput.files[0];
  const dataDisplay = document.getElementById("dataDisplay");
  console.log("🚀 ~ handleFiles ~ dataDisplay:", dataDisplay);

  Papa.parse(file, {
    complete: function (results) {
      parsedData = results.data;
      console.log(parsedData);
      displayData(parsedData, dataDisplay); // Call displayData to show the table
    },
    header: true,
  });
}

const csvData = `Model,Accuracy,Precision,Recall,Auc
                    BERT,84.00,100.00,69.23,84.6
                    LSTM,76.00,75.00,85.71,74.7
                    BiLSTM,64.00,69.23,64.23,64.00
                     
                    RF,76.00,80.00,66.67,74.7
                     SVM,76.00,75.00,75.00,76.00
                     GaussianNB,72.00,70.6,85.71,66.2
                     LR,72.00,92.86,68.42,72.8
                     Kneighbors,76.00,92.86,54.54,79.5`;

const csvData2 = `Model,Accuracy,Precision,Recall,Auc
                    BERT,74.00,70.00,69.63,84.6
                    LSTM,66.40,75.00,85.11,74.7
                    BiLSTM,64.00,69.23,64.23,64.00
                     
                    RF,76.00,80.00,66.67,74.7
                     SVM,76.00,75.00,75.00,76.00
                     GaussianNB,72.00,70.6,85.71,66.2
                     LR,72.00,92.86,68.42,72.8
                     Kneighbors,71.55,92.86,54.54,79.5`;

const onlineStressDataset = `Model,Accuracy,Precision,Recall,Auc
                    BERT,94.00,70.00,69.63,84.6
                    LSTM,46.00,75.00,85.11,74.7
                    BiLSTM,67.91,69.23,64.23,64.00
                     
                    RF,36.00,80.00,66.67,74.7
                     SVM,95.00,75.00,75.00,76.00
                     GaussianNB,72.00,70.6,85.71,66.2
                     LR,42.00,92.86,68.42,72.8
                     Kneighbors,76.00,92.86,54.54,79.5`;

const onlineSuicideDataset = `Model,Accuracy,Precision,Recall,Auc
                    BERT,88.20,90.00,19.63,84.6
                    LSTM,76.00,45.00,85.11,74.7
                    BiLSTM,73.87,69.23,64.23,64.00
                     
                    RF,79.85,80.00,66.67,74.7
                     SVM,65.00,75.00,65.00,76.00
                     GaussianNB,78.00,70.6,85.71,66.2
                     LR,81.00,92.86,68.42,72.8
                     Kneighbors,72.00,62.86,54.54,79.5`;

function displayData(data, dataDisplay) {
  // Create a table element to hold the data
  const table = document.createElement("table");
  table.border = "1";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const headerRow = document.createElement("tr");

  // Add the table headers based on keys from the first row of the data
  if (data.length > 0) {
    Object.keys(data[0]).forEach((key) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = key;
      headerRow.appendChild(headerCell);
    });
  }
  thead.appendChild(headerRow);

  // Add the table rows
  data.forEach((row) => {
    const tableRow = document.createElement("tr");
    Object.values(row).forEach((val) => {
      const tableCell = document.createElement("td");
      tableCell.textContent = val;
      tableRow.appendChild(tableCell);
    });
    tbody.appendChild(tableRow);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  // Clear any previous content and append the new table
  dataDisplay.innerHTML = "";
  dataDisplay.appendChild(table);
}

document.getElementById("start").addEventListener("click", () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function (event) {
    const voiceCommand = event.results[0][0].transcript.toLowerCase();
    displayCommand(voiceCommand);
    // handleVoiceCommand(voiceCommand);
    plotData(voiceCommand, convertStringToObjectArray(currentRawData));
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error", event.error);
  };
});

function displayCommand(command) {
  const instructionsElement = document.getElementById("instructions");
  instructionsElement.textContent = `You said: "${command}"`;
}

document.getElementById("generate_plot").addEventListener("click", () => {
  const plotInput = document.getElementById("plotInput").value;

  try {
    const plotResult = plotData(
      plotInput,
      convertStringToObjectArray(currentRawData)
    );

    // Check if plotResult indicates failure (depending on how plotData is implemented)
    if (!plotResult) {
      //alert('Unable to generate plot. Please check your input.');
    }
  } catch (error) {
    // Catch and handle any errors that occur during plotting
    console.error("Error occurred while generating plot:", error);
    alert("Please Select atleast one Model first.");
  }
});

function plotData(inputData, visualData) {
  const plotTypes = ["bar", "line", "scatter", "pie", "doughnut"];
  const searchData = [
    "Bar",
    "Line",
    "Scatter",
    "Pie",
    "Doughnut",
    "bar",
    "line",
    "scatter",
    "pie",
    "doughnut",
    "accuracy",
    "precision",
    "recall",
    "auc",
    "score",
    "Accuracy",
    "Precision",
    "Recall",
    "Auc",
    "Score",
  ];
  let inputs = inputData?.split(" ");

  // Filter unique values from arrayB that exist in arrayA
  const searchInput = [
    ...new Set(inputs.filter((value) => searchData.includes(value))),
  ];

  searchInput?.forEach((data, index, array) => {
    const trimmedLowerCase = data.trim().toLowerCase();
    const capitalizedString =
      trimmedLowerCase.charAt(0).toUpperCase() + trimmedLowerCase.slice(1);
    array[index] = capitalizedString;
  });

  const plotType = searchInput[0]?.trim().toLowerCase();
  const columns = searchInput?.slice(1).map((col) => col.trim());

  const ctx = document.getElementById("myChart").getContext("2d");

  // Clear any previous chart
  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  // Define a color palette
  const colors = [
    "rgba(255, 99, 132, 0.5)", // Red
    "rgba(54, 162, 235, 0.5)", // Blue
    "rgba(255, 206, 86, 0.5)", // Yellow
    "rgba(75, 192, 192, 0.5)", // Green
    "rgba(153, 102, 255, 0.5)", // Purple
    // Add more colors as needed
  ];

  console.log("🚀 ~ datasets ~ columns:", visualData, columns, selectedModel);
  const getChartLevelValue = visualData.map((item) => item.Model);
  if (plotTypes.includes(plotType)) {
    // Create datasets for each column
    const datasets = columns.map((column, index) => {
      const color = colors[index % colors.length];
      return {
        label: column,
        data: visualData?.map((row) => row[column]),
        backgroundColor: color,
        borderColor: color.replace("0.5", "1"),
        borderWidth: 1,
      };
    });

    // Create a new chart
    window.myChart = new Chart(ctx, {
      type: plotType,
      data: {
        labels:
          plotType === "scatter"
            ? visualData?.map((row) => row[columns[0]])
            : getChartLevelValue,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

document.getElementById("submit").addEventListener("click", () => {
  submitForm();
});

function submitForm() {
  const selectedPlot = document.getElementById("dataset").value;

  // Get selected feature values
  const selectedFeatures = Array.from(
    document.querySelectorAll(".feature-section input:checked")
  )
    .map((checkbox) => checkbox.value)
    .join(" ");

  // Concatenate the selected plot and feature values
  const resultString = `${selectedPlot} ${selectedFeatures}`;

  // Log or use the resultString as needed
  console.log("Result String:", resultString);

  plotData(resultString, convertStringToObjectArray(mainDisplayResultData));
}

function removeValueFromArray(array, valueToRemove) {
  const indexToRemove = array.indexOf(valueToRemove);
  if (indexToRemove !== -1) {
    array.splice(indexToRemove, 1);
  }
}

function makeData(selectedModel) {
  console.log("🚀 ~ makeData ~ filteredCsvData:", selectData, selectedModel);

  if (selectData === "data-set-1") {
    currentSelectedDataset = csvData.split("\n");
  } else if (selectData === "data-set-2") {
    currentSelectedDataset = csvData2.split("\n");
  } else if (selectData === "online-stress") {
    currentSelectedDataset = onlineStressDataset.split("\n");
  } else if (selectData === "online-suicide") {
    currentSelectedDataset = onlineSuicideDataset.split("\n");
  }
  console.log(
    "🚀 ~ makeData ~ currentSelectedDataset:",
    currentSelectedDataset
  );
  const filteredRows = currentSelectedDataset.filter((row, index) => {
    if (index === 0) {
      // Include the header in the filtered rows
      return true;
    }
    const columns = row.split(",");
    const model = columns[0].trim();
    const currentModelData = selectedModel.includes(model);
    return currentModelData;
  });

  const filteredCsvData = filteredRows.join("\n");

  return filteredCsvData;
}

function displayData2(filteredCsvData, dataDisplay) {
  // Create a table element to hold the data
  const table = document.createElement("table");
  table.border = "1";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const rows = filteredCsvData.split("\n");

  // Add the table headers based on the first row of the filtered data
  const headerRow = document.createElement("tr");
  const headerColumns = rows[0].split(",");
  headerColumns.forEach((column) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = column.trim();
    headerRow.appendChild(headerCell);
  });
  thead.appendChild(headerRow);

  // Add the table rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(",");
    const tableRow = document.createElement("tr");
    row.forEach((val) => {
      const tableCell = document.createElement("td");
      tableCell.textContent = val.trim();
      tableRow.appendChild(tableCell);
    });
    tbody.appendChild(tableRow);
  }

  table.appendChild(thead);
  table.appendChild(tbody);

  // Clear any previous content and append the new table
  dataDisplay.innerHTML = "";
  dataDisplay.appendChild(table);
}

function convertStringToObjectArray(dataString) {
  const lines = dataString.split("\n");
  const headers = lines[0].split(",");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(",");
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = currentLine[j].trim();
    }

    result.push(obj);
  }

  return result;
}

/// inserting data set

const dataSet1 = [
  {
    id: "trial_lie_001.txt",
    text: "work slave i really feel like my only purpose in life is to make a higher man money parents forcing me through college and i have too much on my plate i owe a lot of money i know this is the easy way out but i am really tired all of these issues are on top of dealing with tensions in america as well i want to rest",
    deceptive_class: "1",
  },
  {
    id: "trial_lie_002.txt",
    text: "i ll be dead just you wait and see my last words before my death for whoever is interestedi am sorry but youre better off without me youll learn to live without me ",
    deceptive_class: "1",
  },
  {
    id: "trial_lie_003.txt",
    text: "just made this account to test of the site checks account creation date it does not ",
    deceptive_class: "0",
  },
  {
    id: "trial_lie_004.txt",
    text: "going to the circuskinda bummed cuz i m missing a casino trip for this but hopefully it ll be fun",
    deceptive_class: "0",
  },
  {
    id: "trial_lie_005.txt",
    text: "i didnt find one yet i just do not want to also i have a talent for being very bad at killing monsters i will die",
    deceptive_class: "1",
  },
];

const dataSet2 = [
  {
    id: "trial_truth_047.txt",
    text: "asked him instinctively...",
    deceptive_class: "0",
  },
  {
    id: "trial_truth_050.txt",
    text: "At that time on December nineteenth...",
    deceptive_class: "0",
  },
];

// Function to populate the table based on selected dataset
function populateTable(selectedDataset) {
  console.log("🚀 ~ populateTable ~ selectedDataset:", selectedDataset);
  selectData = selectedDataset;
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  let dataSet = [];

  if (selectedDataset === "data-set-1") {
    dataSet = dataSet1;
  } else if (selectedDataset === "data-set-2") {
    dataSet = dataSet2;
  }
  let table = `<table>
      <tr>
        <th>ID</th>
        <th>Text</th>
        <th>Class</th>
      </tr>`;

  dataSet.forEach((data) => {
    table += `
      <tr>
            <td>${data.id}</td>
            <td>${data.text}</td>
            <td>${data.deceptive_class}</td>
      </tr>`;
  });
  table += "</table>";

  // table.style.display = "table"; // Show the table after data is populated
  document.getElementById("dataTable").innerHTML = table;
}

// Event listener for dropdown change
// const dropdown = document.getElementById("train-dataset");
// dropdown.addEventListener("change", function () {
//   const selectedDataset = this.value;
//   console.log("🚀 ~ selectedDataset:", selectedDataset);
//   if (selectedDataset === "online") {
//     fetchAndDisplayData("com.facebook.katana", 100);
//     // return;
//   }
//   populateTable(selectedDataset);
// });

// Initial population of the table with the default; dataset
// populateTable(dropdown.value);

//##########################################################################################################
//##########################################################################################################
//##########################################################################################################
//##########################################################################################################
//#####################################     NEW Data selection        ######################################
//##########################################################################################################
//##########################################################################################################
//##########################################################################################################
//##########################################################################################################
//##########################################################################################################
// document.getElementById("data-set-1").addEventListener("click", () => {
//   console.log("🚀 ~ document.getElementById ~ data-set-1");
//   populateTable("data-set-1");
// });

// document.getElementById("data-set-2").addEventListener("click", () => {
//   console.log("🚀 ~ document.getElementById ~ data-set-2");

//   populateTable("data-set-2");
// });

// Check if the class 'your-class-name' exists in the DOM
// if (document.querySelector("data-set-1")) {
//   document.getElementById("data-set-1").addEventListener("click", () => {
//     console.log("🚀 ~ document.getElementById ~ data-set-1");
//     populateTable("data-set-1");
//   });

//   document.getElementById("data-set-2").addEventListener("click", () => {
//     console.log("🚀 ~ document.getElementById ~ data-set-2");
//     populateTable("data-set-2");
//   });
// }

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
    onlineOptions.forEach((option, index) => {
      if (index === 0) createDatasetButton(option, "online-stress");
      else createDatasetButton(option, "online-suicide");
    });
    secondaryButtonsContainer.style.display = "block";
    sliderContainer.style.display = "block"; // Show slider
  }
}

function createDatasetButton(optionName, className) {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = optionName;
  button.onclick = () => handleDatasetClick(className);
  document.getElementById("secondaryButtons").appendChild(button);
}

// function handleDatasetClick(datasetName) {
//   console.log("🚀 ~ handleDatasetClick ~ datasetName:", datasetName);
//   if (datasetName === "data-set-1" || datasetName === "data-set-2") {
//     populateTable(datasetName);
//   }
//   if (datasetName === "online-stress") {
//     selectData = "online-stress";
//     fetchRedditData("stress", 30);
//   } else if (datasetName === "online-suicide") {
//     selectData = "online-suicide";
//     fetchRedditData("suicidewatch", 30);
//   }
// }

//######################################################
function handleDatasetClick(datasetName) {
  // Save the dataset name to localStorage before reload
  localStorage.setItem("datasetName", datasetName);

  // Reload the page
  location.reload();
}

// After page reload, check if a dataset is stored and perform the action
window.onload = function () {
  const datasetName = localStorage.getItem("datasetName");

  if (datasetName) {
    console.log("🚀 ~ handleDatasetClick ~ datasetName:", datasetName);

    // Perform actions based on dataset name
    if (datasetName === "data-set-1" || datasetName === "data-set-2") {
      populateTable(datasetName);
    }
    if (datasetName === "online-stress") {
      selectData = "online-stress";
      fetchRedditData("suicidewatch", 30);
    } else if (datasetName === "online-suicide") {
      selectData = "online-suicide";
      fetchRedditData("stress", 30);
    }

    // Clear the dataset name from localStorage to prevent repeated actions
    localStorage.removeItem("datasetName");
  }
};
//######################################################

// function handleDatasetClick(datasetName) {
//   document.getElementById('selectedDataset').textContent = `You selected: ${datasetName}`;
//   const postCount = document.getElementById('postSlider').value;

//   if (datasetName === 'Suicide Dataset') {
//       fetchRedditData('suicidewatch', postCount);
//   } else if (datasetName === 'Stress Dataset') {
//       fetchRedditData('stress', postCount);
//   }
// }

function fetchRedditData(subreddit, limit) {
  const apiUrl = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const posts = data.data.children.map((child) => child.data);
      populateTableForOnline(posts);
      // runSVMModel(posts); // Run SVM model on fetched posts
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function populateTableForOnline(posts) {
  // const table = document.getElementById("resultTable");
  // const tableBody = document.getElementById("resultTableBody");
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = ""; // Clear previous data

  let table = `<table>
      <tr>
        <th>Text</th>
        <th>Score</th>
        <th>Comments</th>
      </tr>`;

  posts.forEach((post) => {
    // const row = document.createElement("tr");
    table += `
    <tr>
          <td>${post.title}</td>
          <td>${post.score}</td>
          <td>${post.num_comments}</td>
      </tr>`;
    // tableBody.appendChild(row);
  });
  table += "</table>";

  // table.style.display = "table"; // Show the table after data is populated
  document.getElementById("dataTable").innerHTML = table;
}
// let table =
//   "<table><tr><th>Title</th><th>Rating</th><th>Snippet</th><th>Snippet</th>Likes</tr>";
// reviews.forEach((review) => {
//   table += `<tr>
//                                 <td>${review.title}</td>
//                                 <td>${review.rating}</td>
//                                 <td>${review.snippet}</td>
//                                 <td>${review.likes}</td>
//                               </tr>`;
// });
// table += "</table>";

// document.getElementById("dataTable").innerHTML = table;
