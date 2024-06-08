import { Deeptable, Tile } from 'deepscatter';
import { AtlasDataset, AtlasProjection, AtlasUser } from '@nomic-ai/atlas'
import stableStringify from 'json-stable-stringify';
import { Md5 } from 'ts-md5';
import {
  Float32,
  List,
  Table,
  Vector,
  tableFromArrays,
  tableFromIPC,
  tableToIPC,
} from 'apache-arrow';

export type NeighborParams = {
  input : string,
  projectId : string,
  projectionId: string,
  k: number,
  apiKey: string
}

type Embedding = number[];

type NomicEmbedResponse = {
  embeddings: Embedding[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
  model: EmbeddingModel;
};

const API_BASE_BATH = 'https://api-atlas.nomic.ai'
// It's possible to pull this off the dataset metadata.
type EmbeddingModel = 'nomic-embed-text-v1.5' | 'all-MiniLM-L6-v2'
const SPACE : EmbeddingModel = 'nomic-embed-text-v1.5'
const TASK_TYPE = 'search_query';

export async function fetchNeighbors({input, projectId, k, 
  projectionId, apiKey} : NeighborParams) : 
  Promise<Record<string, any>[]> {

  const user = new AtlasUser({ apiKey })
  const dataset = new AtlasDataset(projectId, user);
  const projection = new AtlasProjection(projectionId, user, {project: dataset})
  const baseUrl =
    API_BASE_BATH +
    '/v1/project/' +
    dataset.id +
    '/index/projection/' +
    projection.id +
    '/quadtree';

  const deeptable = new Deeptable({
    baseUrl,
    tileProxy: dataset,
    rootKey: '0/0/0',
    plot: null,
  });

  const embedding = await getSemanticSearchEmbedding(
    user,
    SPACE,
    TASK_TYPE,
    input
  )
  const columnName = ensureDistanceToEmbeddingColumnExists({
    dataset: deeptable,
    embedding,
    statistic: 'dot',
    taskType: TASK_TYPE,
    projection: projection
  })
  
  const primaryKey = await dataset.info().then(d => d.unique_id_field)

  deeptable.transformations[primaryKey] = async function(tile: Tile) {
    const tb = await tile.get_arrow("datum_id")
    return tb.getChild(primaryKey)
  }

  await deeptable.downloadFieldsToDepth(1e6, [primaryKey, columnName]).catch(err => {throw(err)})

  async function download(tile: Tile) : Promise<Vector[][]> {
      await tile.populateManifest()
      const cols = await Promise.all([primaryKey, columnName].map(d => tile.get_column(d)))
      const children = await tile.allChildren()

      const childBatches = (await Promise.all(children.map(download))).flat()
      return [cols, ...childBatches]
  }

  const rbs = await download(deeptable.root_tile)

  const v = Object.fromEntries([primaryKey, '_distance'].map((name, i) => {
    return [name, new Vector(rbs.map(rb => rb[i]))]
  }))

  const tb = new Table(v)
  const col = tb.getChild('_distance') as Vector<Float32>;

  // Create and sort a list of integers by distance.
  const indices = new Array(tb.numRows)
  for (let i = 0 ; i < tb.numRows; i++) {
    indices[i] = i;
  }

  // Sort by distance.
  indices.sort((a, b) => {
    return col.get(a)! > col.get(b)! ? -1 : 1
  })

  const records = [];
  for (let i = 0; i < k; i++) {
    const row = {...tb.get(indices[i])};
    // TODO: This should not be a naked API call.
    records.push(row)
  }
  const path = '/v1/project/data/get';
  const {datums} = (await dataset.apiCall(path, 'POST', {
    project_id: dataset.id,
//    index_id: await projection.index().then(d => d.id),
    datum_ids: records.map(d => d[primaryKey]),
  })) as { atoms: { [key: string]: any } };

  return records.map((a, i) => {
    return {...a, ...datums[i]}
  })
}

type SemanticSearchParams = {
  dataset: Deeptable;
  embedding: number[];
  statistic: 'dot'
  taskType: 'search_document' | 'search_query'
  projection: AtlasProjection;
};

/**
 *
 * @param p a complete set of parameters defining an embedding distance or similarity statistic
 * @returns the name of the statistic column matching the called parameters
 */
export function ensureDistanceToEmbeddingColumnExists(
  p: SemanticSearchParams
): string {

  const { dataset, embedding, statistic, taskType, projection } = p;

  const key =
    '_distance_statistic_' +
    Md5.hashStr(stableStringify({ embedding: embedding, statistic, taskType }));
  if (dataset.transformations[key]) {
    return key;
  }
  dataset.transformations[key] = async function (tile: Tile) {
    const query = tableFromArrays({
      vector: Float32Array.from(embedding),
    });


    query.schema.metadata.set('project_id', projection.project_id);
    query.schema.metadata.set('tiles', JSON.stringify([tile.key]));
    query.schema.metadata.set('statistic', statistic);

    if (taskType !== null) {
      query.schema.metadata.set('task_type', taskType);
    }

    query.schema.metadata.set('projection_id', projection.id);
    const data = tableToIPC(query, 'file');
    const result = (await projection.apiCall(
      '/v1/project/search/vector',
      'POST',
      data
    )) as Table;
    const v = result.getChild('similarity') as Vector<List<Float32>>;
    // TODO: This could return the Vector if we shared an arrow table.
    const vals = new Float32Array(v.get(0)!.toArray());
    return vals;
  };

  return key;

}


export async function getSemanticSearchEmbedding(
  user: AtlasUser,
  model: EmbeddingModel,
  taskType: 'search_document' | 'search_query' | null,
  text: string
) {
  return (await (
    user.apiCall('/v1/embedding/text', 'POST', {
      model: model,
      // task type option not available for sbert
      task_type: model === 'all-MiniLM-L6-v2' ? null : taskType,
      texts: [text],
    }) as Promise<NomicEmbedResponse>
  ).then(({ embeddings }) => {
    return embeddings[0];
  })) as Embedding;
}