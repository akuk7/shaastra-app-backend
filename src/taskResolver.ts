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
  async completeTask(
    @Arg("description") description: string,
    @Arg("title") title: string
  ): Promise<Task> {
    const task = await Task.create({ title, description }).save();

    return task;
  }

  @Mutation(() => Task)
  async editTask(
    @Arg("id") id: number,
    @Arg("description", { nullable: true }) description: string
  ): Promise<Task | null> {
    const task = await Task.findOne({ where: { id: id } });
    if (!task) {
      return null;
    }
    if (description) {
      task.description = description;
      await task.save();
    }
    return task;
  }

  @Mutation(() => Boolean)
  async deleteTask(@Arg("id") id: number): Promise<boolean> {
    const task = await Task.findOne({ where: { id: id } });
    if (!task) return false;

    await task.remove();
    return true;
  }
}
