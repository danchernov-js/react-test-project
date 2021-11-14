import { resolve } from "q";
import React, {useEffect} from "react"
import TodoList from "./components/TodoList";
import Context from "./context"
import Modal from "./Modal/Modal"
import Loader from "./Loader"

const AddTodo = React.lazy(() => new Promise(resolve => {
  setTimeout(() => {
    resolve(import('./components/AddTodo'))
  }, 3000)
}))

function App() {
  const [todos, setTodos] = React.useState([])
  const [loading, setLoading] = React.useState(true)


  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/?_limit=8')
      .then(response => response.json())
      .then(todos => setTimeout(() => {
        setTodos(todos)
        setLoading(false)
      }, 2000))
  }, [])


  function toggleTodo(id) {
    setTodos(todos.map(todo => {
      if(todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    }))
  }

  function removeTodo(id) {
    setTodos(todos.filter(todo => todo.id !==id ))
  }

  function addTodo(title) {
    setTodos(todos.concat([{
      title: title,
      id: Date.now(),
      completed: false
    }]))
  }
  return (
    <Context.Provider value={{removeTodo: removeTodo}}>
      <div className="wrapper" >
        <h1>React test project</h1>
        <Modal />
        <React.Suspense fallback={<p>Loading..</p>}>
          <AddTodo onCreate={addTodo}/>
        </React.Suspense>

        {loading && <Loader />}
        {todos.length ? <TodoList
          todos={todos}
          onToggle={toggleTodo}
        /> : ( loading ? null :
        <p>NO TODOS</p>)}

      </div>
    </Context.Provider>
  );
}

export default App;
