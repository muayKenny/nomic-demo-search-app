import { NextRequest, NextResponse } from 'next/server';
import { AtlasViewer, AtlasDataset } from '@nomic-ai/atlas';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get('input')!;
  const k = searchParams.get('k') || '10';
  // digest filters and build filter array!

  if (!input) {
    return NextResponse.json(
      { error: 'Input parameter is required' },
      { status: 400 }
    );
  }

  const kNumber = Number(k);
  if (isNaN(kNumber) || kNumber <= 0) {
    return NextResponse.json(
      { error: 'Invalid value for k. It should be a positive number.' },
      { status: 400 }
    );
  }

  // Default projection and dataset IDs for KNN queries.
  // These can be overridden by providing 'projectionId' and 'datasetId' as query parameters.
  const projectionId =
    searchParams.get('projectionId') || process.env.DEFAULT_PROJECTION_ID;
  const datasetId =
    searchParams.get('datasetId') || process.env.DEFAULT_DATASET_ID;
  //should probably validate uuid for both
  if (!projectionId) {
    return NextResponse.json(
      { error: 'projectionId not found' },
      { status: 400 }
    );
  }
  if (!datasetId) {
    return NextResponse.json({ error: 'datasetId not found' }, { status: 400 });
  }

  const apiKey = process.env.PRIVATE_ATLAS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }
  const viewer = new AtlasViewer({ apiKey });

  const search = `data:text/utf-8;charset=utf-8,${encodeURIComponent(input)}`;
  const url = 'https://api-atlas.nomic.ai/v1/query/topk';

  // See: https://docs.nomic.ai/reference/api/query/k-nn-search
  const payload = {
    projection_id: projectionId,
    k: Number(k),
    query: search,
    selection: {
      polarity: true,
      method: 'composition',
      conjunctor: 'ALL',
      filters: [
        // This is really dumb, but we have to pass some query to the API as currently set up.
        // So we just pass a query that won't match anything.
        {
          method: 'search',
          query: "some made up query that won't occur in the data",
          field: 'text',
          polarity: false, // Only *don'* match this query
        },
      ],
    },
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  // return NextResponse.json({ input, k, projectionId, apiKey, url, payload, headers });
  try {
    const result = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!result.ok) {
      throw new Error(
        `Request failed with status ${result.status}: ${result.statusText}`
      );
    }

    const body = await result.json();

    if (!body.data || !Array.isArray(body.data)) {
      throw new Error(
        'Invalid response structure: Missing or malformed "data" field'
      );
    }

    const dataset = new AtlasDataset(datasetId, viewer);
    const data = await dataset.fetch_ids(
      body.data.map((d: { id: string }) => d.id)
    );

    return NextResponse.json(data.datums);
  } catch (error) {
    // Log the error for debugging
    console.error('Error in KNN query:', error);

    // Return a generic error response to the client
    return NextResponse.json(
      { error: 'Failed to fetch neighbors. Please try again later.' },
      { status: 500 }
    );
  }
}
