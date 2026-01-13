import { NextResponse } from 'next/server';

export function handleError(err: Error): Response {
  if (err.message === 'FORBIDDEN' || err.message === 'UNAUTHORIZED') {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (!(err instanceof Error)) {
    console.log('Some unexpected type of error in runtime!');
  }

  return NextResponse.json(
    { message: 'Internal Server Error' },
    { status: 500 }
  );
}
