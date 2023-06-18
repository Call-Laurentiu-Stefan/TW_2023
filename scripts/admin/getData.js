// let paramString = window.location.href.split('?')[1];
//   let queryString = new URLSearchParams(paramString);
//   let page = Array.from(queryString.entries()).length > 0 ? Array.from(queryString.entries())[0][1] : 1;

let paramString = window.location.href.split('?')[1];
let queryString = new URLSearchParams(paramString);
let page = Array.from(queryString.entries()).length > 0 ? Array.from(queryString.entries())[0][1] : 1;
let maxPage;

let geoFilter = Array.from(queryString.entries()).length > 1 ? Array.from(queryString.entries())[1][1] : "";
let timeFilter = Array.from(queryString.entries()).length > 2 ? Array.from(queryString.entries())[2][1] : "";
let bmiFilter = Array.from(queryString.entries()).length > 3 ? Array.from(queryString.entries())[3][1] : "";
document.getElementById("geoFilter").value = geoFilter;
document.getElementById("timeFilter").value = timeFilter;
document.getElementById("bmiFilter").value = bmiFilter;


function getData(geoFilter = null, timeFilter = null, bmiFilter = null) {
  let url = `/OVi/api/bmi-data?pageNumber=${page}`;
  url = geoFilter && geoFilter !== "" ? url.concat(`&geo=${geoFilter}`) : url;
  url = timeFilter && timeFilter !== "" ? url.concat(`&year=${timeFilter}`) : url;
  url = bmiFilter && bmiFilter !== "" ? url.concat(`&bmi=${bmiFilter}`) : url;

  fetch(url)
  .then((response) => response.json())
  .then((body) => {
    console.log(body)
    maxPage = body["totalPages"];
    // Access the retrieved data here
    // Iterate over the data and generate table rows
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    body['data'].forEach((item) => {
      const row = document.createElement("tr");
      const geo = document.createElement("td");
      const time = document.createElement("td");
      const percentage = document.createElement("td");
      const bmi = document.createElement("td");
      const id = document.createElement("td");
      const buttons = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btnDelete";
      deleteBtn.innerHTML = "Delete";
      deleteBtn.type = "button";
      deleteBtn.name = item.id;
      deleteBtn.onclick = function (event) {
        deleteData(event);
      };
      const editBtn = document.createElement("button");
      editBtn.className = "btnEdit";
      editBtn.innerHTML = "Edit";
      editBtn.type = "button";
      editBtn.name = item.id;
      editBtn.onclick = function (event) {
        enableEditable(event);
      };

      geo.textContent = item.geo;
      geo.className = "geo";
      time.textContent = item.time_period;
      time.className = "time_period";
      percentage.textContent = item.obs_value;
      percentage.className = "obs_value";
      bmi.textContent = item.bmi;
      bmi.className = "bmi";
      id.textContent = item.id;
      id.className = "id";
      id.style.display = "none";
      row.id = item.id;

      // Append cells to the row
      row.appendChild(geo);
      row.appendChild(time);
      row.appendChild(percentage);
      row.appendChild(bmi);
      row.appendChild(id);
      buttons.appendChild(editBtn);
      buttons.appendChild(deleteBtn);
      row.appendChild(buttons);
      // Append the row to the table body
      tableBody.appendChild(row);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}

getData(geoFilter, timeFilter, bmiFilter);