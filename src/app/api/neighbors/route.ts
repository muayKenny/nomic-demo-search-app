import { NextRequest, NextResponse } from 'next/server';
import { NeighborParams, fetchNeighbors } from '@/lib/fetchNN';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const input = searchParams.get('input');
  const projectId = searchParams.get('projectId') || '7eafc0fa-9631-4387-8f68-ae81ab61398d';
  const k = searchParams.get('k') || "10";
  const fieldsToReturn = searchParams.getAll('fieldsToReturn') || [];
  const projectionId = searchParams.get('projectionId') || 'ad24e7d9-4e82-484d-a52c-79fed0da2c60'
  const apiKey = process.env.PRIVATE_ATLAS_API_KEY

  // Validate required parameters
  if (!input || !projectId || !k || !fieldsToReturn || !projectionId || !apiKey) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }
  const neighborParams: NeighborParams = {
    input,
    projectId,
    k: parseInt(k),
    projectionId,
    apiKey
  };

  try {
    const result = await fetchNeighbors(neighborParams);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch neighbors' }, { status: 500 });
  }
}