import RepositoryBase from "./base/baseRepository";
import ITask from "../app/models/interfaces/iTask";
import Task from "../app/models/task";

class TaskRepository extends RepositoryBase<ITask> {
  constructor() {
    super(Task)
  }
}

export default TaskRepository;
