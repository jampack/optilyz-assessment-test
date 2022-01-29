import IRepository from "../interfaces/iRepository";

import mongoose from 'mongoose';

class RepositoryBase<T extends mongoose.Document> implements IRepository<T> {

  private _model: mongoose.Model<mongoose.Document>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }

  async create(item: T): Promise<T> {
    const data = await item.save();

    return this.findById(data._id);
  }

  async getAll(): Promise<T[]> {
    return this._model.find().lean();
  }

  async update(_id: string, item: object): Promise<T> {
    await this._model.updateOne({ _id }, item);

    return this.findById(_id);
  }

  async delete(_id: string): Promise<T> {
    const model = await this.findById(_id);

    if(!model){
      return null;
    }

    await this._model.remove({_id}).lean();

    return model;
  }

  async findById(_id: string): Promise<T> {
    return this._model.findById(_id).lean();
  }
}

export = RepositoryBase;
