
const path= require('path');
const {v4: uuidv4} = require('uuid');

const subirArchivo=(files, extensionesValidad = ['png','jpg','jpeg','gif'] ,carpeta ='')=>{

    return new Promise((resolve,rejecjt)=>{
        const {archivo} = files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length-1];
    
   //validar la extension
   if(!extensionesValidad.includes(extension)){
    return rejecjt(`La extension ${extension} no es permitida, ${extensionesValidad} `);
    
   }
   
   const nombreTemp= uuidv4()+'.'+extension;
 
    const uploadPath = path.join(__dirname , '../uploads/',carpeta , nombreTemp);

    archivo.mv(uploadPath, (err)=> {
        if (err) {
            rejecjt(err);
        
        }

        resolve(uploadPath);

       
    });

    });
    

}

module.exports={
    subirArchivo
}