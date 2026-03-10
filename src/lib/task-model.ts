import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  day: number;
  month: number;
  year: number;
  mutable?: boolean;
  order?: number;
}

const taskSchemaDefinition = {
  title: { type: String, required: true },
  description: { type: String, default: '' },
  day: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  mutable: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
};

const TaskSchema = new Schema<ITask>(taskSchemaDefinition, {
  timestamps: true,
});

// Add compound index for date-based queries
TaskSchema.index({ year: 1, month: 1, day: 1 });
// Add index for ordering within a day
TaskSchema.index({ year: 1, month: 1, day: 1, order: 1 });

export const TaskModel = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
