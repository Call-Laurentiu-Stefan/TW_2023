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
}
