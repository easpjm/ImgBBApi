<?php
$data = array();
$ok = '';
if(isset($_FILES['img']) && !empty($_FILES['img']['name'])){
    $imgType = $_FILES['img']['type'];
    if($imgType == 'image/jpg' || $imgType == 'image/jpeg' || $imgType == 'image/png'){
                $image = file_get_contents($_FILES['img']['tmp_name']);
                $imgB64= base64_encode($image);
                $name = $_FILES['img']['name'];
                // Conectarnos con la API ImgBB mediante curl
                curlImgBB($imgB64, $name);
    }else{
        $data['error']="Formato de imagen, no valido!";
    }
}else{
    $data['error']='No se encontro imagen';
}

function curlImgBB($img, $name){
    // cURL es una librería que permite realizar peticiones HTTP con el objetivo de transferir información con sintaxis de URL
    // Conectarse a la API ImgBB mediante cURL
    $apiKey = 'a35d4672e967b0ec6b00756ed4267530';
    define('URL','https://api.imgbb.com/1/upload?key='.$apiKey);
    // $msj = new stdClass();
    $con = curl_init();
    $headers = array('Content-Type : application/x-www-form-urlencoded');
    $imgFinal = array("image" => $img, "name" => $name);
    // Configuramos las opción para la transferencia cURL
    curl_setopt($con, CURLOPT_URL, URL );
    //Para hacer una solicitud post
    curl_setopt($con, CURLOPT_POST, true);
    //Enviamos el input de tipo file
    curl_setopt($con, CURLOPT_POSTFIELDS, $imgFinal);
    //Para poder almacenar en una variable el response del servidor
    curl_setopt($con, CURLOPT_RETURNTRANSFER, true);
    //Verifica si el certifacado del servido es autentico
    curl_setopt($con, CURLOPT_SSL_VERIFYPEER, false);
    // Añadimos  el header para la solicitud
    curl_setopt ($con, CURLOPT_HTTPHEADER, $headers);
    // curl_setopt($con, CURLOPT_BINARYTRANSFER, 1);
    // curl_setopt($con, CURLOPT_HEADER, 0);

    //Executamos la sesión
    $strResponse = curl_exec($con);

    //Manejar los errores
    $curlErrno = curl_errno($con);
    if ($curlErrno)
    {
       $curlError = curl_error($con);
       $data['error'] = $curlError;
       return false;
    }
    //Cerramos la Sesión.
    curl_close($con);
    unset($imgFinal, $headers);
    // El token viene tal cual, ni JSON ni nada, en el propio cuerpo
    $token = $strResponse;
    // La API responde en formato Json
    $obj = json_decode($token);

    $res['status'] = $obj->status;
    $res['success'] = $obj->success;
    $res['delete_url'] = $obj->data->delete_url;
    $res['thumb_url'] = $obj->data->thumb->url;
    $res['thumb_name'] = $obj->data->thumb->name;
    echo json_encode($res);

}

if(!empty($data)){
    echo json_encode($data);
}

?>
