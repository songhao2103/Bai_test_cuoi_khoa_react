import { useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

//Khởi tạo state
const initialState = {
  listTodos: [],
  listFilteredTodos: [],
  inputValue: "",
  key: "all",
};

//reducer
const reducer = (state, action) => {
  switch (action.type) {
    //cập nhật litsFilteredTodos
    case "UPDATELISTFILTERTODOS":
      return { ...state, listFilteredTodos: action.payload.listTodos };

    //thay đổi của input
    case "CHANGEINPUT":
      return { ...state, inputValue: action.payload.value };

    //add todo
    case "ADDTOTO": {
      if (!state.inputValue) {
        return state;
      } else {
        const newToto = {
          name: state.inputValue,
          id: uuidv4(),
          completed: false,
        };
        const newListTodos = [...state.listTodos, newToto];
        return { ...state, listTodos: newListTodos, inputValue: "" };
      }
    }

    //click input checkbox
    case "CLICKINPUTCHECKBOX": {
      const newListTodos = state.listTodos.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, completed: action.payload.value };
        } else {
          return todo;
        }
      });

      return { ...state, listTodos: newListTodos };
    }

    //click option nav
    case "CLICKOPTIONNAV": {
      if (action.payload.value === "all") {
        return {
          ...state,
          listFilteredTodos: state.listTodos,
          key: action.payload.value,
        };
      } else if (action.payload.value === "active") {
        const newListFilteredTodos = state.listTodos.filter(
          (todo) => !todo.completed
        );
        console.log(newListFilteredTodos);

        return {
          ...state,
          listFilteredTodos: newListFilteredTodos,
          key: action.payload.value,
        };
      } else {
        const newListFilteredTodos = state.listTodos.filter(
          (todo) => todo.completed
        );
        return {
          ...state,
          listFilteredTodos: newListFilteredTodos,
          key: action.payload.value,
        };
      }
    }

    //Xóa todo
    case "DELETETODO": {
      if (action.payload.id) {
        const newListTodos = state.listTodos.filter(
          (todo) => todo.id !== action.payload.id
        );
        const newListFilteredTodos = newListTodos.filter(
          (todo) => todo.completed
        );

        return {
          ...state,
          listTodos: newListTodos,
          listFilteredTodos: newListFilteredTodos,
        };
      } else {
        const newListTodos = state.listTodos.filter((todo) => !todo.completed);
        return { ...state, listTodos: newListTodos, listFilteredTodos: [] };
      }
    }
    default:
      return state;
  }
};
const Todo = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //hàm để cập nhập giá trị của listFilterdTodos
  useEffect(() => {
    if (state.key !== "completed") {
      dispatch({
        type: "UPDATELISTFILTERTODOS",
        payload: {
          listTodos: state.listTodos,
        },
      });
    }
  }, [state.listTodos]);

  //hàm theo dõi thay đổi của ô input
  const handleChangeInput = (e) => {
    const value = e.target.value;
    dispatch({
      type: "CHANGEINPUT",
      payload: {
        value,
      },
    });
  };

  //hàm xử lý khi add todo
  const handleAddTodo = () => {
    dispatch({
      type: "ADDTOTO",
    });
  };

  //hàm xử lý khi click vào ô input type checkbox
  const handleClickInputCheckbox = (e, id) => {
    const value = e.target.checked;
    dispatch({
      type: "CLICKINPUTCHECKBOX",
      payload: {
        id,
        value,
      },
    });
  };

  //hàm xử lý khi click vào các lựa chọn của thanh navbar
  const handleClickOptionNav = (value) => {
    dispatch({
      type: "CLICKOPTIONNAV",
      payload: {
        value,
      },
    });
  };

  //hàm xử lý xóa todo
  const handleDeleteToto = (id) => {
    dispatch({
      type: "DELETETODO",
      payload: {
        id,
      },
    });
  };

  console.log(state.listFilteredTodos);

  return (
    <div className="todo_page">
      <ul className="nav">
        <li
          className={`item desc ${state.key === "all" ? "active" : ""}`}
          onClick={() => handleClickOptionNav("all")}
        >
          All
        </li>
        <li
          className={`item desc ${state.key === "active" ? "active" : ""}`}
          onClick={() => handleClickOptionNav("active")}
        >
          Active
        </li>
        <li
          className={`item desc ${state.key === "completed" ? "active" : ""}`}
          onClick={() => handleClickOptionNav("completed")}
        >
          Completed
        </li>
      </ul>

      {state.key !== "completed" && (
        <div className="box_add">
          <input
            type="text"
            value={state.inputValue}
            placeholder="Add todo"
            onChange={handleChangeInput}
          />
          <button className="btn desc" onClick={handleAddTodo}>
            Add
          </button>
        </div>
      )}

      <ul className="list_todos">
        {state.listFilteredTodos.map((todo) => (
          <div className="box_todo" key={todo.id}>
            <div className="todo">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => handleClickInputCheckbox(e, todo.id)}
              />
              <p className={`desc ${todo.completed ? "active" : ""}`}>
                {todo.name}
              </p>
            </div>
            {state.key === "completed" && (
              <div className="delete" onClick={() => handleDeleteToto(todo.id)}>
                <i className="fa-solid fa-trash-can"></i>
              </div>
            )}
          </div>
        ))}

        {state.key === "completed" && state.listFilteredTodos.length !== 0 && (
          <div
            className="btn delete_all desc"
            onClick={() => handleDeleteToto(null)}
          >
            Delete all
          </div>
        )}
        {state.listFilteredTodos.length === 0 && (
          <div className="not_yet_todo">
            {state.key === "all" && <p className="desc">Không có todo nào</p>}
            {state.key === "active" && (
              <p className="desc">Không có todo nào chưa hoàn thành</p>
            )}
            {state.key === "completed" && (
              <p className="desc">Không có todo nào đã hoàn thành</p>
            )}
          </div>
        )}
      </ul>
    </div>
  );
};

export default Todo;
