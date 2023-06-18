<?php
include("C:\\xampp\htdocs\OVi\API\database.php");

class BMIDataController
{
    private $conn;

    public function __construct()
    {
        $this->conn = connect();
    }

    public function getAllData()
    {
        $query = "SELECT id, geo, time_period, obs_value, bmi FROM data ORDER BY last_update DESC";
        $result = runSQL($this->conn, $query);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    public function addData($entry)
    {
        $sql = "INSERT INTO Data(geo, time_period, obs_value, bmi, last_update) VALUES (?,?,?,?,?)";
        $stmt = $this->conn->prepare($sql);
        $time_created = date("d/m/y H:i:s");
        $stmt->bind_param("sssss", $entry->geo, $entry->time_period, $entry->obs_value, $entry->bmi, $time_created);
        $result = $stmt->execute();
        if (!($result)) {
            echo $stmt->error;
            die ('Error at adding data');
        }else{
            $response['status_code_header'] = 'HTTP/1.1 201 CREATED';
            $response['body'] = json_encode($entry);
            return $response;
        }
    }

    public function deleteData($entryId){
        $sql = "DELETE FROM data WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $entryId);
        $result = $stmt->execute();
        if (!($result)) {
            echo $stmt->error;
            die ('Error at removing data');
        }else{
            $response['status_code_header'] = 'HTTP/1.1 204 NO CONTENT';
            $response['body'] = json_encode($entryId);
            return $response;
        }
    }

    public function editData($entryId, $entry){
        $sql = "UPDATE data SET geo = ?, time_period = ?, obs_value = ?, bmi = ?, last_update = ? WHERE id = ?";
        $time_updated = date("d/m/y H:i:s");
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssssi", $entry->geo, $entry->time_period, $entry->obs_value, $entry->bmi, $time_updated, $entryId );
        $result = $stmt->execute();
        if (!($result)) {
            echo $stmt->error;
            die ('Error at updating data');
        }else{
            $response['status_code_header'] = 'HTTP/1.1 204 NO CONTENT';
            $response['body'] = json_encode($entryId);
            return $response;
        }
    }

    public function getPaginatedData($pageNumber, $pageSize)
    {
        // Calculate the starting record index for the specified page
        $startIndex = ($pageNumber - 1) * $pageSize;
        $stmt = '';
        if(isset($_GET['geo']) && isset($_GET['year']) && isset($_GET['bmi'])){
            $geo = $_GET['geo'];
            $year = $_GET['year'];
            $bmi = $_GET['bmi'];
            $query = "SELECT id, geo, time_period, obs_value, bmi FROM data WHERE geo LIKE CONCAT(?,'%') AND time_period LIKE CONCAT(?,'%') AND bmi LIKE CONCAT(?,'%') ORDER BY last_update DESC LIMIT ?, ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("sssss", $geo, $year, $bmi, $startIndex, $pageSize);
        }
        else if(isset($_GET['geo'])&&isset($_GET['year'])){
            $geo = $_GET['geo'];
            $year = $_GET['year'];
            $query = "SELECT id, geo, time_period, obs_value, bmi FROM data WHERE geo LIKE CONCAT(?,'%') AND time_period LIKE CONCAT(?,'%') ORDER BY last_update DESC LIMIT ?, ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("ssss", $geo, $year, $startIndex, $pageSize);
        }
        else if(isset($_GET['year']) && isset($_GET['bmi'])){
            $year = $_GET['year'];
            $bmi = $_GET['bmi'];
            $query = "SELECT id, geo, time_period, obs_value, bmi FROM data WHERE time_period LIKE CONCAT(?,'%') AND bmi LIKE CONCAT(?,'%') ORDER BY last_update DESC LIMIT ?, ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("ssss", $year, $bmi, $startIndex, $pageSize);
        }
        else if(isset($_GET['geo']) && isset($_GET['bmi'])){
            $geo = $_GET['geo'];
            $bmi = $_GET['bmi'];
            $query = "SELECT id, geo, time_period, obs_value, bmi FROM data WHERE geo LIKE CONCAT(?,'%') AND bmi LIKE CONCAT(?,'%') ORDER BY last_update DESC LIMIT ?, ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("ssss", $geo, $bmi, $startIndex, $pageSize);
        }
        else if(isset($_GET['geo'])){
            $geo = $_GET['geo'];
            $query = "SELECT id, geo, time_period, obs_value, bmi FROM data WHERE geo LIKE CONCAT(?,'%') ORDER BY last_update DESC LIMIT ?, ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("sss", $geo, $startIndex, $pageSize);
        }
        else if(isset($_GET['year'])){
            $year = $_GET['year'];
            $query = "SELECT id, geo, time_period, obs_value, bmi FROM data WHERE time_period LIKE CONCAT(?,'%') ORDER BY last_update DESC LIMIT ?, ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("sss", $year, $startIndex, $pageSize);
        }
        else if(isset($_GET['bmi'])){
            $bmi = $_GET['bmi'];
            $query = "SELECT id, geo, time_period, obs_value, bmi FROM data WHERE bmi LIKE CONCAT(?,'%') ORDER BY last_update DESC LIMIT ?, ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("sss", $bmi, $startIndex, $pageSize);
        } else {
            $query = "SELECT id, geo, time_period, obs_value, bmi FROM data ORDER BY last_update DESC LIMIT ?, ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("ss", $startIndex, $pageSize);
        }

        $stmt->execute();
        $stmt->bind_result($id, $geo, $time_period, $obs_value, $bmi);
        $data = [];
        while ($stmt->fetch()) {
            $data[] = [
                'id' => $id,
                'geo' => $geo,
                'time_period' => $time_period,
                'obs_value' => $obs_value,
                'bmi' => $bmi,
            ];
        }
        $stmt->free_result();
        $stmt->close();
        
        // Retrieve the total number of records
        $countQuery = "SELECT COUNT(*) AS total FROM data";
        $countResult = runSQL($this->conn, $countQuery);
        $totalRecords = $countResult[0]['total'];

        // Calculate the total number of pages
        $totalPages = ceil($totalRecords / $pageSize);

        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode([
            'pageNumber' => $pageNumber,
            'pageSize' => $pageSize,
            'totalRecords' => $totalRecords,
            'totalPages' => $totalPages,
            'data' => $data,
        ]);

        return $response;
    }
}
