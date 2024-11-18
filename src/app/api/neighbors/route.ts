import { NextRequest, NextResponse } from 'next/server';
import { Embedder, AtlasViewer, AtlasDataset, AtlasProjection } from '@nomic-ai/atlas';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get('input')!;
  const k = searchParams.get('k') || "10";
  const projectionId = searchParams.get('projectionId') || 'ad24e7d9-4e82-484d-a52c-79fed0da2c60'
  const datasetId = '7eafc0fa-9631-4387-8f68-ae81ab61398d'
  const apiKey = process.env.PRIVATE_ATLAS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }
  const viewer = new AtlasViewer({apiKey})
  // We have to run the embedding first because our image maps were uploaded as embeddings.
  // If moving to a different map, might need to use nomic-embed-text-v1.5
  const embedder = new Embedder(viewer, {model: 'nomic-embed-text-v1.5'});
  const embedding = JSON.stringify(await embedder.embed(input));
  const search = `data:application/json;charset=utf-8,${embedding}`
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
              {
                  "method": "search",
                  "query": "e",
                  "field": "text",
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