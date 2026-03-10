import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { TaskModel } from '@/lib/task-model';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { day, month, year, taskOrders } = body;

    // Validate required fields
    if (
      day === undefined ||
      month === undefined ||
      year === undefined ||
      !Array.isArray(taskOrders)
    ) {
      return NextResponse.json(
        { error: 'Missing required fields: day, month, year, taskOrders' },
        { status: 400 }
      );
    }

    // Validate date ranges
    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2100) {
      return NextResponse.json(
        {
          error:
            'Invalid date values. Month must be 1-12, Day must be 1-31, Year must be 1900-2100',
        },
        { status: 400 }
      );
    }

    // Validate taskOrders format: array of { id: string, order: number }
    for (const item of taskOrders) {
      if (!item.id || typeof item.order !== 'number') {
        return NextResponse.json(
          { error: 'Invalid taskOrders format. Each item must have id and order' },
          { status: 400 }
        );
      }
      if (!mongoose.Types.ObjectId.isValid(item.id)) {
        return NextResponse.json({ error: `Invalid task ID format: ${item.id}` }, { status: 400 });
      }
    }

    await connectToDatabase();

    // Use bulkWrite for better performance with multiple updates
    const bulkOps = taskOrders.map((item: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(item.id), day, month, year },
        update: { $set: { order: item.order } },
      },
    }));

    if (bulkOps.length > 0) {
      await TaskModel.bulkWrite(bulkOps);
    }

    return NextResponse.json({ success: true, message: 'Tasks reordered successfully' });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return NextResponse.json({ error: 'Failed to reorder tasks' }, { status: 500 });
  }
}
