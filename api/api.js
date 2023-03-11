let TODO_DB = [
    {
        id: '1',
        title: '테스트 1',
        desc: '테스트 입니다. 1',
        date: '123',
    },
    {
        id: '2',
        title: '테스트 2',
        desc: '테스트 입니다. 2',
        date: '123',
    }
];
let auto_increment_key = 3;

function generateKey() {
    return (auto_increment_key++).toString();
}

export function getTodoList() {
    return Promise.resolve(TODO_DB)
}

export function createTodoItem(newTodo) {
    const newData = {
        id: generateKey(),
        ...newTodo
    };
    TODO_DB.push(newData)
    return Promise.resolve(newData)
}

export function deleteTodoItem(todoKey) {
    TODO_DB = TODO_DB.filter((value) => value.key !== todoKey);
    return Promise.resolve({ok: true})
}

export function updateTodoItem(todoKey, newValue) {
    const index = TODO_DB.findIndex((value) => value.key === todoKey)
    if (index >= 0) {
        TODO_DB[index] = {
            ...newValue,
            todoKey: todoKey
        }
    }
    return Promise.resolve({ok: true})
}