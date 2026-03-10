import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TaskModel } from '@/lib/task-model';

export async function GET() {
  try {
    await connectToDatabase();
    const tasks = await TaskModel.find({}).sort({ year: 1, month: 1, day: 1, order: 1 });
    // Convert _id to string for each task for JSON serialization
    const tasksWithStringIds = tasks.map((task) => ({
      ...task.toObject(),
      _id: task._id.toString(),
    }));
    return NextResponse.json(tasksWithStringIds);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, day, month, year, mutable } = body;

    if (!title || day === undefined || month === undefined || year === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: title, day, month, year' },
        { status: 400 }
      );
    }

    // Validate date ranges with proper date validation
    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2100) {
      return NextResponse.json(
        {
          error:
            'Invalid date values. Month must be 1-12, Day must be 1-31, Year must be 1900-2100',
        },
        { status: 400 }
      );
    }

    // Validate actual date (e.g., Feb 30 is invalid)
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return NextResponse.json(
        { error: 'Invalid date. The specified day does not exist in this month.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Use atomic operation to get and increment the highest order for tasks on this day
    // to minimize race condition window. The unique index on (day, month, year, order)
    // provides the safety net against true duplicates.
    const lastTask = await TaskModel.findOne({ day, month, year })
      .sort({ order: -1 })
      .select('order')
      .lean();

    const newOrder = lastTask && lastTask.order !== undefined ? lastTask.order + 1 : 0;

    const newTask = await TaskModel.create({
      title: title.trim() || 'Untitled',
      description: description?.trim() || '',
      day,
      month,
      year,
      mutable: mutable ?? true,
      order: newOrder,
    });

    // Convert _id to string for JSON serialization
    const taskWithStringId = {
      ...newTask.toObject(),
      _id: newTask._id.toString(),
    };

    return NextResponse.json(taskWithStringId, { status: 201 });
  } catch (error) {
    // Handle duplicate key error (race condition)
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      console.error('Duplicate order detected');
      return NextResponse.json(
        { error: 'Concurrent task creation detected. Please retry.' },
        { status: 409 }
      );
    }
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
