import {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import TaskRepository from "../../repositories/taskRepository";
import Task from "../models/task";
import mapper from "../../lib/mapper";
import UserDto from "../../mappings/dtos/user.dto";
import UserType from "../../mappings/types/user.type";
import TaskDto from "../../mappings/dtos/task.dto";
import TaskType from "../../mappings/types/task.type";
import ITask from "../models/interfaces/iTask";

const taskRepository = new TaskRepository();

export const index = async (req: Request, res: Response) => {
  taskRepository.getAll().then((tasks) => {
    res.send(tasks.map((task) => mapper.map(task, TaskDto, TaskType)));
  }).catch((err) => {
    res.send(err);
  })
}

export const show = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).send("No id provided");
  }

  taskRepository.findById(req.params.id).then((task) => {
    res.send(mapper.map(task, TaskDto, TaskType));
  }).catch((err) => {
    res.send(err);
  })
}

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

export const update = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const authUser = mapper.map(req.user, UserDto, UserType);

  const isTask = await taskRepository.findById(req.body.id);

  if (isTask && authUser.id.toString() !== isTask.creator._id.toString()) {
    return res.status(422).send({error: "You cannot modify this task"});
  }

  const updatedTask = {
    title: req.body.title,
    description: req.body.description,
    completeBefore: req.body.completeBefore,
    notifyAt: req.body.notifyAt,
    isComplete: req.body.isComplete,
    creator: authUser.id,
  };

  taskRepository.update(req.body.id, updatedTask).then((task) => {
    res.send(mapper.map(task, TaskDto, TaskType));
  }).catch((err) => {
    res.send(err);
  })
}

export const patch = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const authUser = mapper.map(req.user, UserDto, UserType);

  let previousData: ITask;
  const isTask = previousData = await taskRepository.findById(req.body.id);

  if (isTask && authUser.id.toString() !== isTask.creator._id.toString()) {
    return res.status(422).send({error: "You cannot modify this task"});
  }

  const updatedTask = {
    title: req.body.title ? req.body.title : previousData.title,
    description: req.body.description ? req.body.description : previousData.description,
    completeBefore: req.body.completeBefore ? req.body.completeBefore : previousData.completeBefore,
    notifyAt: req.body.notifyAt ? req.body.notifyAt : previousData.notifyAt,
    isComplete: req.body.isComplete ? req.body.isComplete : previousData.isComplete,
    creator: authUser.id,
  };

  taskRepository.update(req.body.id, updatedTask).then((task) => {
    res.send(mapper.map(task, TaskDto, TaskType));
  }).catch((err) => {
    res.send(err);
  })
}

export const destroy = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).send("No id provided");
  }

  const isTask = await taskRepository.findById(req.params.id);

  if (!isTask) {
    return res.status(404).send("Task not found");
  }

  const authUser = mapper.map(req.user, UserDto, UserType);

  if (isTask.creator._id.toString() !== authUser.id.toString()) {
    return res.status(403).send("You are not allowed to delete this task");
  }

  taskRepository.delete(req.params.id).then((task) => {
    res.send(mapper.map(task, TaskDto, TaskType));
  }).catch((err) => {
    res.send(err);
  })
}

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
        body('isComplete', 'Invalid value').notEmpty().isBoolean(),
      ]
    }

    case 'updateTask': {
      return [
        body('id', "ID is required").notEmpty(),
        body('title', 'Title is required').notEmpty(),
        body('title', 'Title is too long').isLength({max: 160}),
        body('description', 'Description is too long').isLength({max: 1000}),
        body('completeBefore', 'Complete before is required').notEmpty(),
        body('completeBefore', 'Complete before is not a valid date').isDate(),
        body('completeBefore', 'Complete before date cannot be in the past').isAfter(),
        body('notifyAt', 'Notify at is required').notEmpty(),
        body('notifyAt', 'Notify at is not a valid date').isDate(),
        body('notifyAt', 'Notify at date cannot be in the past').isAfter(),
        body('isComplete', 'Invalid value').notEmpty().isBoolean(),
      ]
    }

    case 'patchTask': {
      return [
        body('id', "ID is required").notEmpty(),
        body('title', 'Title is too long').if(body('title').exists()).isLength({max: 160}),
        body('description', 'Description is too long').if(body('description').exists()).isLength({max: 1000}),
        body('completeBefore', 'Complete before is not a valid date').if(body('completeBefore').exists()).isDate(),
        body('completeBefore', 'Complete before date cannot be in the past').if(body('completeBefore').exists()).isAfter(),
        body('notifyAt', 'Notify at is not a valid date').if(body('notifyAt').exists()).isDate(),
        body('notifyAt', 'Notify at date cannot be in the past').if(body('notifyAt').exists()).isAfter(),
        body('isComplete', 'Invalid value').if(body('isComplete').exists()).isBoolean(),
      ]
    }

    default: {
      throw new Error(`Invalid request validation method: ${method}`);
    }
  }
}
