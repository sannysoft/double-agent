import fetch from 'node-fetch';
import IAssignment from '@double-agent/collect-controller/interfaces/IAssignment';

export { IAssignment };

export default async function assignmentServer<T = any>(path: string, params: { userId: string, dataDir?: string }) {
  const controllerDomain = process.env.DA_COLLECT_CONTROLLER_DOMAIN ?? 'localhost';
  const controllerPort = process.env.DA_COLLECT_CONTROLLER_PORT ? Number(process.env.DA_COLLECT_CONTROLLER_PORT) : 3000;

  const paramStrs = [`userId=${params.userId}`];
  if (params.dataDir) paramStrs.push(`dataDir=${params.dataDir}`);

  const res = await fetch(`http://${controllerDomain}:${controllerPort}${path}?${paramStrs.join('&')}`);
  const contentType = res.headers.get('content-type');

  if (contentType === 'application/json') {
    const data = await res.json();
    if (res.status >= 400) {
      throw new Error(data.message)
    }
    return data;
  }

  return res.body;
}
