import { NextResponse } from 'next/server';
import { createTodoAction } from '../../actions';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await createTodoAction(formData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/todos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 