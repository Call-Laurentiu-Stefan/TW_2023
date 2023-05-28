function enableEditable(event) {
  debugger;
  var elementId = event.currentTarget.getAttribute("name");
  var row = document.getElementById(elementId);
  row.childNodes.forEach((child) => {
    if (child.childNodes.length <= 1) {
      child.contentEditable = true;
    } else {
      child.childNodes.forEach((button) => {
        if (button.className == "btnEdit") {
          button.textContent = "Save";
          button.className = "btnSave";
          button.onclick = function (event) {
            editData(event);
          };
        } else if (button.className == "btnDelete") {
          button.textContent = "Cancel";
          button.className = "btnCancel";
          button.onclick = function () {
            cancelEdit(elementId);
          };
        }
      });
    }
  });
}

async function editData(event) {
  var elementId = event.currentTarget.getAttribute("name");
  var entry = getInputData(elementId);

  const response = await fetch(`/OVi/api/bmi-data/${elementId}`, {
    method: "PUT",
    body: JSON.stringify(entry),
  });
  undoRow(elementId);
  const responseData = await response.json();
  return responseData;
}

function cancelEdit(elementId) {
  undoRow(elementId);
}

function getInputData(elementId) {
  var element = {};
  var row = document.getElementById(elementId);
  row.childNodes.forEach((child) => {
    if (child.childNodes.length <= 1) {
      element[child.className] = child.innerHTML;
    }
  });
  return element;
}

function undoRow(elementId) {
  var row = document.getElementById(elementId);
  row.childNodes.forEach((child) => {
    if (child.childNodes.length <= 1) {
      child.contentEditable = false;
    } else {
      child.childNodes.forEach((button) => {
        if (button.className == "btnSave") {
          button.textContent = "Edit";
          button.className = "btnEdit";
          button.onclick = function (event) {
            enableEditable(event);
          };
        } else if (button.className == "btnCancel") {
          button.textContent = "Delete";
          button.className = "btnDelete";
          button.onclick = function (event) {
            deleteData(event);
          };
        }
      });
    }
  });
}
