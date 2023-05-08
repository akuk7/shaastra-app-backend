import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Task } from "./Task";

@Resolver(Task)
export class TaskResolver {
  @Query(() => [Task])
  async getTasks(): Promise<Task[]> {
    const tasks = await Task.find();
    return tasks;
  }
  @Query(() => Task)
  async getTask(@Arg("id") id: number): Promise<Task> {
    const task = await Task.findOne({ where: { id: id } });
    if (!task) {
      throw new Error("task not found");
    }
    return task;
  }
  @Mutation(() => Task)
  async createTask(
    @Arg("description") description: string,
    @Arg("title") title: string
  ): Promise<Task> {
    const task = await Task.create({ title, description }).save();

    return task;
  }
  @Mutation(() => Task)
  async editTask(
    @Arg("id") id: number,
    @Arg("description") description: string,
    @Arg("title") title: string
  ): Promise<Task> {
    const result = await Task.update(id, {
      title: title,
      description: description,
    });
    const updatedTask = await Task.findOne({ where: { id: id } });
    if (!updatedTask) {
      throw new Error("Task not found");
    }
    return updatedTask;
  }

  @Mutation(() => Boolean)
  async markTaskComplete(@Arg("id") id: number): Promise<Boolean> {
    const result = await Task.update(id, { completed: true });
    return result.affected === 1;
  }

  @Mutation(() => Boolean)
  async markTaskIncomplete(@Arg("id") id: number): Promise<Boolean> {
    const result = await Task.update(id, { completed: false });
    return result.affected === 1;
  }

  @Mutation(() => Boolean)
  async deleteTask(@Arg("id") id: number): Promise<Boolean> {
    const task = await Task.findOne({ where: { id: id } });
    if (!task) return false;

    await task.remove();
    return true;
  }
}
