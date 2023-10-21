import { useState } from 'react'
import { Text, UnstyledButton, TextInput } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import classes from '../styles/taskListStyles.module.css'

class TaskClass {
  desc: string;
  name: string;
  completed: boolean;
  index: number;

  constructor(name:string, desc:string, index: number, completed?: boolean) {
    this.name=name;
    this.desc=desc;
    this.index=index;
    this.completed=completed ?? false;
  }
}
type taskType = InstanceType<typeof TaskClass>

function Task({data, completeTask, deleteTask, editTask, moveTaskUp, moveTaskDown, topTask, bottomTask}:{data: taskType, completeTask: () => void, deleteTask: () => void, editTask: (editState:number, newValue:string) => void, moveTaskUp: () => void, moveTaskDown: () => void, topTask: boolean, bottomTask: boolean}) {
  const [editingState, setEditingState] = useState(0) // 0 = none, 1 = title, 2 = desc
  const ref = useClickOutside(() => setEditingState(0));
  const checkIfInputSubmit = (event:any) => {
    if (event.key==='Enter' || event.key==='Escape') {
      setEditingState(0)
    }
  }
  return(
    <div className={classes.taskWrapper} data-top-task={topTask ? true : null}>
      <div className={classes.taskBurgerWrapper}>
        <UnstyledButton className={classes.unselectable} component='img' src='./trash.svg' onClick={deleteTask}/>

        <div className={classes.taskArrowWrapper}>
          {topTask==false && <UnstyledButton component='img' src='./up.svg' className={classes.unselectable} onClick={moveTaskUp}/>}
          <div className={classes.taskIndex}>{data.index+1}</div>
          {bottomTask==false && <UnstyledButton component='img' src='./down.svg' className={classes.unselectable} onClick={moveTaskDown}/>}
        </div>

        <div className={classes.taskTextWrapper}>
          {
            editingState==1 ?
            <TextInput autoFocus={true} onKeyUp={checkIfInputSubmit} ref={ref} value={data.name} onChange={(event) => editTask(1, event.currentTarget.value)}/> :
            <Text size="xl" td={data.completed ? "line-through" : ""} onClick={() => setEditingState(1)}>{data.name}</Text>
          }
          {
            editingState==2 ?
            <TextInput autoFocus={true} onKeyUp={checkIfInputSubmit} ref={ref} value={data.desc} onChange={(event) => editTask(2, event.currentTarget.value)}/> :
            <Text c="dimmed" fs={data.completed ? "italic" : ""} onClick={() => setEditingState(2)}>{data.desc}</Text>
          }
          
        </div>
      </div>
      <UnstyledButton className={classes.unselectable} component='img' src={data.completed ? './x.svg' : './checkmark.svg'} onClick={completeTask}/>
    </div>
  )
}

function NewTaskButton({createNewTask}:{createNewTask: () => void}) {
  return(
    <UnstyledButton className={classes.newTaskButton} component='img' src='./plus.svg' onClick={createNewTask}/>
  )
}

function EmptyTask() {
  return(
    <div className={classes.taskWrapper} data-top-task={true} data-empty-task={true}>
      Consider adding some tasks!
    </div>
  )
}

function TaskList() {
  const [taskList, setTaskList] = useState<Array<taskType>>([])
  const createNewTask = () => setTaskList(curTasks => [...curTasks, new TaskClass(`New task ✨`, 'Task description.', curTasks.length)])
  const completeTask = (taskIndex:number) => setTaskList(curTasks => curTasks.map((curTask, curTaskIndex) => curTaskIndex==taskIndex ? {...curTask, completed: !curTask.completed} : curTask))
  const deleteTask = (taskIndex:number) => setTaskList(curTasks => curTasks.filter((_curTask, curTaskIndex) => curTaskIndex!=taskIndex).map((curTask, curTaskIndex) => curTaskIndex>=taskIndex ? {...curTask, index: curTask.index-1} : curTask))
  const editTask = (taskIndex:number, editState:number, newValue:string) => setTaskList(curTasks => curTasks.map((curTask, curTaskIndex) => curTaskIndex==taskIndex ? (editState==1 ? {...curTask, name: newValue} : {...curTask, desc: newValue}) : curTask))
  const moveTask = (taskIndex:number, moveDirection:1 | -1) => setTaskList(curTasks => curTasks.map((curTask, curTaskIndex) => curTaskIndex==taskIndex+moveDirection ? {...curTasks[taskIndex], index: taskIndex+moveDirection} : curTaskIndex==taskIndex ? {...curTasks[taskIndex+moveDirection], index: taskIndex} : curTask))

  return (
    <div className={classes.taskListWrapper}>
      {
        taskList.length==0 ?
        <EmptyTask />
        :
        taskList.map((curTask:taskType, taskIndex:number) =>
          <Task
            data={curTask}  
            topTask={taskIndex==0}
            bottomTask={taskIndex==taskList.length-1}
            deleteTask={() => deleteTask(taskIndex)}
            completeTask={() => completeTask(taskIndex)}
            editTask={(editState, newValue) => editTask(taskIndex, editState, newValue)}
            moveTaskUp={() => moveTask(taskIndex, -1)}
            moveTaskDown={() => moveTask(taskIndex, 1)}
            
          />
        )
      }
      <NewTaskButton createNewTask={createNewTask}/>
      
    </div>
    
  )
}

export default TaskList
