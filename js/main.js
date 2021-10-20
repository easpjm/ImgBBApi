const inpFilePath = document.querySelector('#formFile');
const preview = document.querySelector('.img-preview');
const form = document.getElementById('formMain');
const btnSend = document.querySelector('#btnSend');
var showError = document.getElementById('alert');
const contentImg = document.querySelector('#content-img');
var savedData = [];


document.addEventListener('DOMContentLoaded', function(){
    
    if(localStorage.getItem('saveImg') !== null){
        let data = JSON.parse(localStorage.getItem('saveImg'));
        savedData = data;
        showImg();       
    }
});

let showImg = ()=>{
    contentImg.innerHTML = '';
    for(let img of savedData){
        // crear un template literals o templete strings
        let image = `
                <figure class="figure">
                    <div class="curtain">
                        <button class="close" onclick="deleteImg(event,'${img.name}')"><i class="far fa-times-circle fa-2x"></i></button>
                    </div>
                    <img src="${img.url}" class="figure-img img-fluid rounded  shadow" width="200px" height="200px" alt="...">
                    <figcaption class="figure-caption">${img.name}.</figcaption>
                </figure>`;
        contentImg.innerHTML += image;
    }
}

inpFilePath.addEventListener('change', function(){
    const file = this.files[0];
    const fileType = this.files[0].type;
    // Instanciamos nuestro constructor de imagenesFile
    const image = new Image(50, 50);
    if(file){
        if(fileType == 'image/jpeg' || fileType == 'image/png'){
            // Llamamos al objeto FileReader, que nos permite leer 
            // los fichero o la imformacion que esta en buffer
            const reader = new FileReader();
            // llamamos al evento onload
            reader.onload = ()=>{
                const result = reader.result;
                image.src = result;
                image.className = 'img-thumbnail';
                // llamamos a la propiedad innerHTML
                preview.innerHTML = '';
                preview.append(image);
            }
            // llamamos al metodo readAsDataURL este nos entregara
            // la url de la imagen como un string de caracteres codificados en base64
            reader.readAsDataURL(file);
        }
    }
});

btnSend.onclick = (e) => {
    e.preventDefault();
    btnSend.disabled = true;
    // Llamamos a la intefas formData
    const data = new FormData(form);
    let date = new Date();
    let time = new String(date.getTime());
    let name = time + Math.floor(Math.random() * 10);
    preview.innerHTML = '<i class="fas fa-circle-notch fa-2x fa-spin"></i>';
    // Validar si existe un titulo para image
    if(data.get('imgName') == ''){
        data.set('imgName', 'img_' + name);
    }
    sendData(data);
}

const sendData = async(data) => {
    // vamos a utilzar fetch que es una nueva forma de hacer solicitudes asincronas
    return await fetch('./controllers/uploadimg.php', {
        method: 'POST',
        body: data
    })
    // vamos a utilizar un una palabra reservada llamada then
    // Que nos permitira extender la funcionalidad de fetch
    // cunado termine de ejecutarse fetch a mandar a llamar a lo que haya en then
    // Entonces creamos una function dentron de then
    .then(res => {
        if(res.ok){
            return res.json();
        }else{
            Notiflix.Notify.Failure('¡Ocurrio un error inesperado!');
        }
    })
    .then(res => {
        if(res.error){
            showMessage('error', res.error);
            preview.innerHTML = '<i class="fas fa-image fa-5x"></i>';
        }else{
            const objImg = {
                name: data.get('imgName').toLowerCase(),
                url: res.thumb_url
            };
            saveData(objImg);
        }
    })
}

const saveData = data => {
    savedData.push(data);
    localStorage.setItem('saveImg', JSON.stringify(savedData));
    showMessage('success', '¡Imagen subida satisfactoriamente!');
    btnSend.disabled = false;
    showImg();
    clearForm();
}

// form.onsubmit = async(e) => {
//     e.preventDefault();
//     const data = new FormData(form);
//     let date = new Date();
//     let string = new String(date.getTime());
//     let name = string + Math.floor(Math.random() * 10);
//     preview.innerHTML = `<div class="preloader-wrapper big active">
//     <div class="spinner-layer spinner-blue-only">
//       <div class="circle-clipper left">
//         <div class="circle"></div>
//       </div><div class="gap-patch">
//         <div class="circle"></div>
//       </div><div class="circle-clipper right">
//         <div class="circle"></div>
//       </div>
//     </div>
//   </div`;
//     if(data.get('imgName') == ''){
//         data.set('imgName', name)
//     }
//     return await fetch('./controllers/uploadimg.php', {
//         method: 'POST',
//         body: data
//     })
//     .then(res => {
//         if(res.ok){
//             return res.json();
//         }else{
//             throw 'Error encontrado';
//         }
//     })
//     . then(res => {
        
//         if(res.error){
//             showMessage('error', res.error);
//             preview.innerHTML = '<i class="large material-icons" style="opacity: .5;">image</i>';
//         }else{
//             console.log(res);
//             const objImg = {
//                 name: 'img_'+res.thumb_name,
//                 rute: res.thumb_url
//             }
//             savedData.push(objImg);
//             localStorage.setItem('imgThumb', JSON.stringify(savedData));
//             let image = `
//             <div class="col s4">
//                 <div class="img-detail">
//                     <img src="${objImg.rute}" class="materialboxed" data-caption="${objImg.name}" alt="${objImg.name}" />
//                     <small>${objImg.name}</small>
//                 </div>
//             </div>
//             `; 
//             showMessage('success', 'Imagen subida satisfactoriamente!');
//             contentImg.innerHTML += image;
//             clearForm();

//         }
//     })
//     .catch(error => console.log(error))
// }

let clearForm = () => {
    form.reset();
    preview.innerHTML = '<i class="fas fa-image fa-5x"></i>';
}

let showMessage = (style, status) => {
    btnSend.disabled = false;
    if(style == 'error'){
        Notiflix.Notify.Failure(status);
        // showError.classList.add(style);
        // showError.innerHTML = status;
        // showError.style.visibility = "visible";
        // showError.style.opacity = "1";

    }else if(style == 'success'){
        Notiflix.Notify.Success(status);
        // showError.classList.add(style);
        // showError.innerHTML = status;
        // showError.style.visibility = "visible";
        // showError.style.opacity = "1";
    }
}

const deleteImg = (e,name) => {
    e.preventDefault();
    Notiflix.Confirm.Show( 
        'Confirmar eliminación', 
        '¿Realmente quieres eliminar este contenido? Esto no se podrá deshacer.', 
        'Confirmar', 'Cancelar', 
    function(){ // Yes button callback 
        let objIndex = savedData.findIndex((obj => obj.name === name));
        if(objIndex != -1){
            savedData.splice(objIndex, 1);
            localStorage.setItem('saveImg', JSON.stringify(savedData));
            Notiflix.Notify.Success('Imagen eliminada exitosamente');
            showImg();
        } 
    }
   ); 
    
}
// https://i.ibb.co/7kjCcdd/img-fondo-1-jpg.jpg
// TODO: Reparar funcion deleteImg