import * as http from 'http';
import { IncomingMessage, Server, ServerResponse } from 'http';
import url from 'url';
import DetectionsServer from './DetectionsServer';

export default class DirectiveServer {
  private readonly server: http.Server;
  private readonly routes = {
    '/': this.nextDirective.bind(this),
    '/create': this.createDirective.bind(this),
    '/results': this.getResults.bind(this),
  };

  constructor(readonly detectionsServer: DetectionsServer) {
    this.server = new Server(this.handleRequest.bind(this));
  }

  public listen(port: number, listeningListener?: () => void) {
    return this.server.listen(port, listeningListener);
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    const requestUrl = url.parse(req.url, true);

    if (!this.routes[requestUrl.pathname]) {
      return res.writeHead(200).end();
    }

    console.log('Directives %s', req.url);
    const scraperDir = req.headers.scraper ?? requestUrl.query.scraper;
    if (!scraperDir) {
      return sendJson(res, { message: 'Please provide a scraper header or query param' }, 500);
    }
    await this.routes[requestUrl.pathname](req, res, scraperDir as string);
  }

  private async getResults(_, res: ServerResponse, scraperDir: string) {
    const result = await this.detectionsServer.saveScraperResults(
      scraperDir,
      `${__dirname}/../../scrapers/${scraperDir}`,
    );
    console.log(
      '\n\n--------------------  Results Complete for "%s"  -------------------\n\n',
      scraperDir,
    );
    sendJson(res, { result });
  }

  private async nextDirective(_, res: ServerResponse, scraperDir: string) {
    const directive = await this.detectionsServer.nextDirective(scraperDir);
    sendJson(res, { directive });
  }

  private async createDirective(_, res: ServerResponse, scraperName: string) {
    const directive = await this.detectionsServer.createSessionDirectives(scraperName);
    sendJson(res, { directive });
  }
}

function sendJson(res: ServerResponse, json: any, status = 200) {
  res.writeHead(status, {
    'content-type': 'application/json',
  });
  res.end(JSON.stringify(json));
}