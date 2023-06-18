<?php
session_start();

// Check if the user is not logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
  header("Location: login.html"); // Redirect to the login page
  exit;
}
?>


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="styles/header.css" />
    <link rel="stylesheet" href="styles/admin.css" />
    <link rel="stylesheet" href="styles/footer.css" />

    <title>OVi</title>
  </head>
  <body>
    <div class="wrap">
      <header class="header">
        <a href="index.html">
          <img src="resources/logo_1.png" alt="OVi" />
        </a>
        <nav id="header">
          <ul>
            <li><a href="logout.php">Logout</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="about.html">About</a></li>
          </ul>
        </nav>
      </header>
      <div class="data">
        <button type="button" class="btnNew" id="btnNew">Add New Entry</button>
        <div id="myModal" class="modal">
          <div class="modal-content">
              <span class="close">&times;</span>
              <h2>Enter Data</h2>
              <form method="POST" class="modal-form">
                  <label for="geo">Geopolitical Entity</label>
                  <input type="text" id="geo" name="geo" required>
                  <label for="time_period">Time period:</label>
                  <input type="text" id="time_period" name="time_period" required>
                  <label for="obs_value">Percentage value:</label>
                  <input type="text" id="obs_value" name="obs_value" required>
                  <label for="bmi">BMI:</label>
                  <input type="text" id="bmi" name="bmi" required>
                  <button type="button" onClick="createData();">Create</button>
              </form>
          </div>
      </div>
  
        <table>
          <tr>
            <th>
              Geopolitical Entity
              <input type="text" placeholder="Search for Geopolitical Entity" />
            </th>
            <th>
              Time
              <input type="text" placeholder="Search for Time" />
            </th>
            <th>Percentage</th>
            <th>
              BMI
              <input type="text" placeholder="Search for BMI" />
            </th>
            <th>Actions</th>
          </tr>
          <tbody id="table-body"></tbody>
        </table>
      </div>
    </div>
    <div class="footer">
      <span
        >OVi is a project developed by Call Laurentiu-Stefan, Rosca Victor and
        Tabacaru Andrei-Stefan as part of the "Web Technologies" course of the
        Faculty of Computer Science in Iasi tasked with the creation of a
        responsive website that offers a proper way to visualise and work with
        large datasets.</span
      >
    </div>
    <script src="scripts/admin/deleteData.js"></script>
    <script src="scripts/admin/getData.js"></script>
    <script src="scripts/admin/modal.js"></script>
    <script src="scripts/admin/createData.js"></script>
    <script src="scripts/admin/editData.js"></script>
    </body>
</html>
