fetch("/OVi/api/bmi-data")
  .then((response) => response.json())
  .then((data) => {
    // Access the retrieved data here
    // Iterate over the data and generate table rows
    const tableBody = document.getElementById("table-body");

    data.forEach((item) => {
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
