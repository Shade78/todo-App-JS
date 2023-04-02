 // находим эл-т на странице
const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

let tasks = []

if (localStorage.getItem('tasks')) { // если в LS пусто - возвращается null, соотв-но строка - true
    tasks = JSON.parse(localStorage.getItem('tasks'))
}


tasks.forEach(function (task){
    renderTask(task)
})

checkemptyList()

// добавление задачи
form.addEventListener('submit', addTask)
// удаление задачи
tasksList.addEventListener('click', deleteTask)
// отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask)

function addTask(event) {
    // отменяем стандартное поведение - отправку формы
    event.preventDefault();

    // достаем текст задачи из поля ввода
    const taskText = taskInput.value

    // описание задачи в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    // добавляем объект в массив с задачами
    tasks.push(newTask)
    // сохраняем задачу в хранилище браузера LocalStorage
    saveToLocalStorage()

    renderTask(newTask)

    // очищаем поле ввода и возвращаем на него фокус
    taskInput.value = ""
    taskInput.focus()

    checkemptyList()
}

function deleteTask(event) {      
    // если клик был НЕ по кнопке удалить
    if (event.target.dataset.action !== 'delete') {
        return
    }

    // если клик был  по кнопке удалить
    const parentNode = event.target.closest('.list-group-item') // можно просто "li"

    // определяем id задачи
    const id = Number(parentNode.id)

    // находим индекс задачи в массиве
    const index = tasks.findIndex(function(task){
        if (task.id === id){
            return true
        }

        // можно return taks.id === id
    })
    // удаляем задачу из массива
    tasks.splice(index, 1)

    // сохраняем задачу в хранилище браузера LocalStorage
    saveToLocalStorage()

    parentNode.remove()   
    
    checkemptyList()
}

function doneTask(event) {
    // проверяем, что клик был по НЕ кнопке задача выполнена
    if (event.target.dataset.action !== 'done'){
        return
    }
    // проверяем, что клик был по кнопке задача выполнена
    if (event.target.dataset.action === 'done') {   // можно убрать условие, но я оставлю для понимания
        const parentNode = event.target.closest('.list-group-item') // можно просто "li"
        // определяем id задачи
        const id = Number(parentNode.id)

        const task = tasks.find(function(task) {
            if (task.id === id){
                return true
            }
        })

        task.done = !task.done

        // сохраняем задачу в хранилище браузера LocalStorage
        saveToLocalStorage()

        const taskTitle = parentNode.querySelector('.task-title')
        taskTitle.classList.toggle('task-title--done')
    }

    if(tasksList.children.length === 1) {
        emptyList.classList.remove('none')
    }

}

function checkemptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `
                <li id="emptyList" class="list-group-item empty-list">
                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                    <div class="empty-list__title">Список дел пуст</div>
				</li>`;
        tasksList.insertAdjacentHTML(`afterbegin`, emptyListHTML)
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList')
        emptyListEl ? emptyListEl.remove() : null;
    }
}


// сохранение массива в LS
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    // формируем CSS класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title"

    // формируем рзметку для новой задачи
    const taskHtml = `
                        <li id="${task.id}"class="list-group-item d-flex justify-content-between task-item">
                            <span class="${cssClass}">${task.text}</span>
                            <div class="task-item__buttons">
                                <button type="button" data-action="done" class="btn-action">
                                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                                </button>
                                <button type="button" data-action="delete" class="btn-action">
                                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                                </button>
                            </div>
                        </li>
                    `
    // добавляем задачу на страницу 
    tasksList.insertAdjacentHTML('beforeend', taskHtml)
}