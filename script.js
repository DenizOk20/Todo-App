let editId;
let iseditTask = false;
const taskInput = document.querySelector('#txtTaskName');
const btnClear = document.querySelector('#btnClear');
const ekle = document.querySelector('#btnAddNewTask');
const press = document.querySelector('#btnAddNewTask');
const filters = document.querySelectorAll('.filters span');


let gorevListesi = [];

if(localStorage.getItem("gorevListesi") !== null){
    gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
}

Görevler(document.querySelector('span.active').id);


function Görevler(filter){
    ul = document.getElementById('task-list');
    ul.innerHTML = '';

    if(gorevListesi.length == 0){
        ul.innerHTML = `<p class="p-3 m-0">Görev listesi boş</p>`
    }
    else{

        for(let görev of gorevListesi){

            const completed = görev.durum == "completed" ? "checked": "";

            if(filter ==görev.durum || filter == 'all'){
                let li = `
            <li class="task list-group-item">
                <div class="form-check">
                    <input type="checkbox" onclick="updateStatus(this)" id="${görev.id}" class="form-check-input" ${completed}>
                    <label for="${görev.id}" class="form-check-label ${completed}">${görev.GörevAdı}</label>
                </div>
                <div class="dropdown">
                    <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a onclick = "deleteTask(${görev.id})" class="dropdown-item" href="#">Sil <i class="fa-solid fa-trash-can"></i></a></li>
                        <li><a onclick = 'editTask(${görev.id}, "${görev.GörevAdı}")' class="dropdown-item" href="#">Düzenle <i class="fa-solid fa-pen"></i></a></li>
                    </ul>
                    </div>
            </li>
        `;
                ul.insertAdjacentHTML('beforeend',li);        
            }
   
        }   
    }
}

for(let span of filters){
    span.addEventListener('click',function(){
        document.querySelector('span.active').classList.remove('active');
        span.classList.add('active');
        Görevler(span.id);

    }) ;
   }

function yeniGorev(e){
    const taskInput = document.querySelector('#txtTaskName');

    if(taskInput.value == ''){
        alert('Görev Giriniz...');
    }
    else{
        if(!iseditTask){
            gorevListesi.push({'id':gorevListesi.length+1, 'GörevAdı': taskInput.value,'durum':'pending'});
        }
        else{
            for(let gorev of gorevListesi){
                if(gorev.id == editId){
                    gorev.GörevAdı = taskInput.value;
                }
                iseditTask = false;
            }
        }
        taskInput.value = '';
        Görevler(document.querySelector('span.active').id);
        localStorage.setItem('gorevListesi',JSON.stringify(gorevListesi));
    }
    e.preventDefault();
}


function pressEnter(){
    if(e.key == 'Enter'){
        document.getElementById('#btnAddNewTask').click();
    }
}

 function deleteTask(id){
 let deletedId;
 deletedId = gorevListesi.findIndex(function(gorev){
    return gorev.id == id;
});

gorevListesi.splice(deletedId,1);
Görevler(document.querySelector('span.active').id);
localStorage.setItem('gorevListesi',JSON.stringify(gorevListesi));

}

function editTask(taskId,taskName){
    editId = taskId;
    iseditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add('active');

    console.log('edit id:',editId);
    console.log('edit mode:',iseditTask);
}

function hepsiniSilme(){
    gorevListesi.splice(0,gorevListesi.length);
    localStorage.setItem('gorevListesi',JSON.stringify(gorevListesi));
    Görevler(document.querySelector('span.active').id);
}

function updateStatus(selectedTask){
    const label = selectedTask.nextElementSibling;
    let durum;

    if(selectedTask.checked){
        label.classList.add('checked');
        durum = 'completed';
    }
    else{
        label.classList.remove('checked');
        durum = 'pending';
    }
    for(let gorev of gorevListesi){
        if(gorev.id == selectedTask.id){
            gorev.durum = durum;
        }
    }
    Görevler(document.querySelector('span.active').id);
    localStorage.setItem('gorevListesi',JSON.stringify(gorevListesi));

}

btnClear.addEventListener('click',hepsiniSilme);
ekle.addEventListener('click', yeniGorev);
press.addEventListener('keypress',pressEnter);