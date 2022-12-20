const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();//crea servidor

app.use(express.json());

const jsonPath = path.resolve('./file/tasks.json')

app.get('/tasks', async(req, res)=>{
  //obtener el json
  const jsonFile = await fs.readFile(jsonPath, 'utf8');
  //enviar la respuesta
  res.send(jsonFile);
})

//Creacion de usuarios dentro del json
app.post('/tasks', async(req, res)=>{
const tasks = req.body;
//obrener el arreglo desde json file
const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
console.log(tasksArray);
//agregar las tareas en el arreglo
//generar un nuevo id
const lastIndex= tasksArray.length-1;
const newId = tasksArray[lastIndex].id+1;

tasksArray.push({...tasks, id: newId});
//escribir la informacion en el json
await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
res.end();
});

//Actualizacion de las tareas
//actualizar toda la informacion
//body enviemos el id del usuario a actualizar
//put es el metodo para actualizar
app.put('/tasks', async(req, res)=>{
//obtenemos el arreglo desde el json file
const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
const {title, description, status, id} = req.body;//se saca todos los datos del json
//buscar el id de las tareas dentro del arreglo
const tasksIndex = tasksArray.findIndex(task => task.id === id);
if(tasksIndex >=0){
  //tasksArray[tasksIndex].title = title;
  //tasksArray[tasksIndex].description = description;
  tasksArray[tasksIndex].status = status;
  
}
//escribir nuevamente el arreglo en el archivo
await fs.writeFile(jsonPath, JSON.stringify(tasksArray));

res.send('Usuario actualizado');


});

//eliminando tarea
app.delete('/tasks', async(req, res) =>{
//obtener el arreglo
const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
const {id} = req.body;
//encontrar la tare que se quiere eliminar (id)
const tasksIndex = tasksArray.findIndex(task => task.id === id);
//se elimina del arreglo
tasksArray.splice(tasksIndex, 1);
//se escribe en el json nuevamente
await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
res.end();
})

//req = request     res= response


const PORT = 8000;//puerto del servidor

app.listen(PORT, () =>{
  console.log(`SERVIDOR ESCUCHANDO EN EL PUERTO ${PORT}`);
});


