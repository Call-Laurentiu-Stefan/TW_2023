<?php
function connect()
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "ovi";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

function runSQL($conn, $sql)
{
    $result = $conn->query($sql);
    if ($result === FALSE) {
        die("Error while executing query: " . $conn->error);
    } else {
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}
?>