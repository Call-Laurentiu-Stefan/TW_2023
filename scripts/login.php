<?php
session_start();

function validate($data) {
  $data = trim($data);
  return $data;
}

$host = "localhost";
$username = "root";
$password = "";
$database = "ovi";

$mysqli = new mysqli($host, $username, $password, $database);
if ($mysqli->connect_errno) {
  echo "Failed to connect to MySQL: " . $mysqli->connect_error;
}

if (isset($_POST['username']) && isset($_POST['password'])) {
  $username = validate($_POST['username']);
  $password = validate($_POST['password']);

  $stmt = $mysqli->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
  $stmt->bind_param("ss", $username, $password);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows === 1) {
    $_SESSION['logged_in'] = true;
    header("Location: ../admin.php");
    exit;
  } else {
    echo "Invalid username or password.";
  }

  $stmt->close();
} else {
  echo "Please fill in the username and password fields.";
}

$mysqli->close();
?>
