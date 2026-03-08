import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { TaskModel } from "@/lib/task-model";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid task ID format" }, { status: 400 });
    }
    
    await connectToDatabase();
    const task = await TaskModel.findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Convert _id to string for JSON serialization
    const taskWithStringId = {
      ...task.toObject(),
      _id: task._id.toString(),
    };
    return NextResponse.json(taskWithStringId);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description } = body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid task ID format" }, { status: 400 });
    }

    await connectToDatabase();
    const task = await TaskModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: {
          ...(title !== undefined && { title: title.trim() || "Untitled" }),
          ...(description !== undefined && { description: description.trim() }),
        },
      },
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Convert _id to string for JSON serialization
    const taskWithStringId = {
      ...task.toObject(),
      _id: task._id.toString(),
    };
    return NextResponse.json(taskWithStringId);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid task ID format" }, { status: 400 });
    }
    
    await connectToDatabase();
    const task = await TaskModel.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
