import {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import TaskRepository from "../../repositories/taskRepository";
import Task from "../models/task";
import mapper from "../../lib/mapper";
import UserDto from "../../mappings/dtos/user.dto";
import UserType from "../../mappings/types/user.type";
import TaskDto from "../../mappings/dtos/task.dto";
import TaskType from "../../mappings/types/task.type";

const taskRepository = new TaskRepository();

export const store = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const authUser = mapper.map(req.user, UserDto, UserType);

  const newTask = new Task({
    title: req.body.title,
    description: req.body.description,
    completeBefore: req.body.completeBefore,
    notifyAt: req.body.notifyAt,
    creator: authUser.id,
  });

  taskRepository.create(newTask).then((task) => {
    res.send(mapper.map(task, TaskDto, TaskType));
  }).catch((err) => {
    res.send(err);
  });
};

export const validate = (method: string) => {
  switch (method) {
    case 'createTask': {
      return [
        body('title', 'Title is required').notEmpty(),
        body('title', 'Title is too long').isLength({max: 160}),
        body('description', 'Description is too long').isLength({max: 1000}),
        body('completeBefore', 'Complete before is required').notEmpty(),
        body('completeBefore', 'Complete before is not a valid date').isDate(),
        body('completeBefore', 'Complete before date cannot be in the past').isAfter(),
        body('notifyAt', 'Notify at is required').notEmpty(),
        body('notifyAt', 'Notify at is not a valid date').isDate(),
        body('notifyAt', 'Notify at date cannot be in the past').isAfter(),
      ]
    }
  }
}
