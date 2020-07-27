import IRequestContext from '../interfaces/IRequestContext';
import IDomainset from '../interfaces/IDomainset';
import { IncomingMessage, ServerResponse } from 'http';
import IRequestDetails from '../interfaces/IRequestDetails';
import HostDomain from '../interfaces/HostDomain';
import { getOriginType } from '../detections-server/extractRequestDetails';
import UserBucketTracker from './UserBucketTracker';
import DetectionSession from './DetectionSession';
import { URL } from 'url';

export default class RequestContext implements IRequestContext {
  constructor(
    public readonly req: IncomingMessage,
    public readonly res: ServerResponse,
    public readonly url: URL,
    public readonly requestDetails: IRequestDetails,
    public readonly session: DetectionSession,
    public readonly domains: IDomainset,
    public readonly bucketTracker: UserBucketTracker,
  ) {}

  public readonly extraHead: string[] = [];
  public readonly extraScripts: string[] = [];

  public trackUrl(path: string, domain?: HostDomain, protocol?: string) {
    const { url, host } = this.buildHostUrl(
      path,
      domain ?? this.requestDetails.hostDomain,
      protocol,
    );
    const origin = getOriginType(this.url, this.requestDetails.hostDomain, this.domains);

    this.session.trackAsset(url, origin, this.domains, this.requestDetails.url);

    if (host === this.url.origin) {
      return [url.pathname, url.search].filter(Boolean).join('');
    }

    return url.href;
  }

  private buildHostUrl(path: string, domain: HostDomain, protocol = 'http') {
    let host: string;
    const domains = this.domains;
    if (domain === HostDomain.Sub) {
      host = domains.listeningDomains.subdomain.href;
    } else if (domain === HostDomain.External) {
      host = domains.listeningDomains.external.href;
    } else if (domain === HostDomain.Main) {
      host = domains.listeningDomains.main.href;
    }

    const url = new URL(path, host);
    url.protocol = url.protocol.replace('http', protocol);

    return { url, host };
  }
}
