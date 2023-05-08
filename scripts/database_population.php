<?php
$servername = "localhost";
$username = "admin";
$password = "admin123";
$dbname = "ovi";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

function runSQL($conn, $sql)
{
  if ($conn->query($sql) === TRUE) {
    echo "Query executed successfully";
  } else {
    echo "Error while executing query: " . $conn->error;
  }
}

function parseCSV($conn,$path){
  $row = 1;
  if (($handle = fopen($path, "r")) !== FALSE) {
    $sql = "INSERT INTO Data(dataflow, last_update, freq, unit, bmi, geo, time_period, obs_value, obs_flag) VALUES (?,?,?,?,?,?,?,?,?)";
    $stmt = $conn->prepare($sql);
    $skipFirstRow = true;
    while (($data = fgetcsv($handle)) !== false) {
      if ($skipFirstRow) {
        $skipFirstRow = false;
        continue;
      }
      $stmt->bind_param("sssssssss", $data[0], $data[1], $data[2], $data[3], $data[4], $data[5], $data[6], $data[7], $data[8]);
      $stmt->execute();
  }
  }
  fclose($handle);
}

// sql to create table
$sql = "CREATE TABLE Users (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(30) NOT NULL,
password VARCHAR(30) NOT NULL,
email VARCHAR(50)
)";

runSQL($conn,$sql);

$usernames = ["laur","victor","andrei"];
for ($i=0; $i < 3; $i++) { 
  // $sql ="INSERT INTO Users(username,password) VALUES(\"{$usernames[$i]}\",\"{$usernames[$i]}\")";
     $sql = 'INSERT INTO Users(username,password) VALUES(?,?)';
     $stmt = $conn->prepare($sql);
     $stmt->bind_param("ss",$usernames[$i], $usernames[$i]);
        if (!($stmt->execute())) {
            echo $stmt->error;
            die ('Error at adding users');
        }
 }

$sql = "CREATE TABLE Data (
   id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   dataflow VARCHAR(30) NOT NULL,
   last_update VARCHAR(30) NOT NULL,
   freq VARCHAR(30) NOT NULL,
   unit VARCHAR(30) NOT NULL,
   bmi VARCHAR(30) NOT NULL,
   geo VARCHAR(30) NOT NULL,
   time_period VARCHAR(30) NOT NULL,
   obs_value VARCHAR(30) NOT NULL,
   obs_flag VARCHAR(30)
   )";

runSQL($conn,$sql);

$path = '../resources/data/sdg_02_10_linear.csv';
parseCSV($conn, $path);

$conn->close();
?>
