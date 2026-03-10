import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { TaskModel } from '@/lib/task-model';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID format' }, { status: 400 });
    }

    await connectToDatabase();
    const task = await TaskModel.findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Convert _id to string for JSON serialization
    const taskWithStringId = {
      ...task.toObject(),
      _id: task._id.toString(),
    };
    return NextResponse.json(taskWithStringId);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, day, month, year } = body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID format' }, { status: 400 });
    }

    // Validate date fields if provided
    if (day !== undefined && (day < 1 || day > 31)) {
      return NextResponse.json({ error: 'Invalid day value. Must be 1-31' }, { status: 400 });
    }
    if (month !== undefined && (month < 1 || month > 12)) {
      return NextResponse.json({ error: 'Invalid month value. Must be 1-12' }, { status: 400 });
    }
    if (year !== undefined && (year < 1900 || year > 2100)) {
      return NextResponse.json({ error: 'Invalid year value. Must be 1900-2100' }, { status: 400 });
    }

    // Validate actual date if all date fields are provided
    if (day !== undefined && month !== undefined && year !== undefined) {
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return NextResponse.json(
          { error: 'Invalid date. The specified day does not exist in this month.' },
          { status: 400 }
        );
      }
    }

    await connectToDatabase();
    const task = await TaskModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: {
          ...(title !== undefined && { title: title.trim() || 'Untitled' }),
          ...(description !== undefined && { description: description.trim() }),
          ...(day !== undefined && { day }),
          ...(month !== undefined && { month }),
          ...(year !== undefined && { year }),
        },
      },
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Convert _id to string for JSON serialization
    const taskWithStringId = {
      ...task.toObject(),
      _id: task._id.toString(),
    };
    return NextResponse.json(taskWithStringId);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID format' }, { status: 400 });
    }

    await connectToDatabase();
    const task = await TaskModel.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
