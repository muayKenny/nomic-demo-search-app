import { NextRequest, NextResponse } from 'next/server';
import { Embedder, AtlasViewer, AtlasDataset, AtlasProjection } from '@nomic-ai/atlas';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get('input')!;
  const k = searchParams.get('k') || "10";

  // We hard-code an image dataset here. Could change though to other datasets, text or images.
  const projectionId = searchParams.get('projectionId') || 'ad24e7d9-4e82-484d-a52c-79fed0da2c60'
  const datasetId = searchParams.get('datasetId') || '7eafc0fa-9631-4387-8f68-ae81ab61398d'

  const apiKey = process.env.PRIVATE_ATLAS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }
  const viewer = new AtlasViewer({apiKey})

  const search = `data:text/utf-8;charset=utf-8,${encodeURIComponent(input)}`
  const url = "https://api-atlas.nomic.ai/v1/query/topk"

  // See: https://docs.nomic.ai/reference/api/query/k-nn-search
  const payload = {
      "projection_id": projectionId,
      "k": Number(k),
      "query": search,
      "selection": {
          "polarity": true,
          "method": "composition",
          "conjunctor": "ALL",
          "filters": [
            // This is really dumb, but we have to pass some query to the API as currently set up.
            // So we just pass a query that won't match anything.
              {
                  "method": "search",
                  "query": "some made up query that won't occur in the data",
                  "field": "text",
                  "polarity": false, // Only *don'* match this query
              }
          ]
        }
    }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    }


  // return NextResponse.json({ input, k, projectionId, apiKey, url, payload, headers });
  try {
    const result = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    }).then(async res => {
      const body = await res.json()
      const dataset = new AtlasDataset(datasetId, viewer);
      const data = await dataset.fetch_ids(body.data.map(d => d.id))
      return data.datums
  });
    return NextResponse.json(result);
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: 'Failed to fetch neighbors' }, { status: 500 });
  }
}