function sendPost(){
    fetch('http://192.168.1.98:8090/user/email?email=some@gmail.com', {
        method: 'GET',
    })
        .then(response => {
            if(response["status"] == 200){
                response.json().then(data => {
                    console.log(data);
                })
            }
            if(response["status"] == 500){
            response.text().then(data => {console.log(data)});
            }
        });
}