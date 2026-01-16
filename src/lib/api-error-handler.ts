import { NextResponse } from 'next/server';

export function handleError(err: Error): Response {
  if (err.message === 'UNAUTHORIZED') {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }

  if (err.message === 'FORBIDDEN') {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }

  if (!(err instanceof Error)) {
    console.log('Some unexpected type of error in runtime!');
  }

  console.error(err);

  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
