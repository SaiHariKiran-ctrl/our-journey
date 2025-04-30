import { NextResponse } from 'next/server';
import { updateTodoStatus } from '../../../actions';

export async function POST(request: Request) {
  try {
    const { id, isCompleted } = await request.json();
    
    if (!id || typeof isCompleted !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const result = await updateTodoStatus(id, isCompleted);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/todos/status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 