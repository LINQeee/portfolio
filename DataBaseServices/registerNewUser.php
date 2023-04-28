<?php
$servername = "localhost";
$username = "a0806580_project_mainDB";
$password = "adrian19032008!!!";
$dbname = "a0806580_project_mainDB";

$_POST = json_decode(file_get_contents('php://input'), true);

$conn = new mysqli($servername, $username, $password, $dbname);

$requestResult;

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

switch($_POST[0]['functionName']){
    case 'insert':

        $sql = "INSERT INTO ".$_POST[1]['dbName']." (username, email, password)
        VALUES ('".$_POST[1]['username']."', '".$_POST[1]['email']."', '".$_POST[1]['password']."')";

        if ($conn->query($sql) === TRUE) {
            $requestResult = "New record created successfully";
        } else {
            $requestResult = "Error: " . $sql . "<br>" . $conn->error;
        }

        break;
}


  
$conn->close();


echo $requestResult;

?>