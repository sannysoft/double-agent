Double Agent is a suite of tools written to allow a scraper engine to test if it is detectable when trying to blend into the most common web traffic.

## Structure:

DoubleAgent has been organized into two main layers:
 
- `/collect`: scripts/plugins for collecting browser profiles. Each plugin generates a series of pages to test how a browser behaves.
- `/analyze`: scripts/plugins for analyzing browser profiles against verified profiles. Scraper results from `collect` are compared to legit "profiles" to find discrepancies. These checks are given a Looks Human"&trade; score, which indicates the likelihood that a scraper would be flagged as bot or human.
 
The easiest way to use `collect` is with the collect-controller:
- `/collect-controller`: a server that can generate step-by-step assignments for a scraper to run all tests

## Plugins

The bulk of the `collect` and `analyze` logic has been organized into what we call plugins.

### Collect Plugins
Name | Description
--- | :---
browser-codecs | Collects the audio, video and WebRTC codecs of the browser
browser-dom-environment | Collects the browser's DOM environment such as object structure, class inheritance amd key order
browser-fingerprints | Collects various browser attributes that can be used to fingerprint a given session
browser-fonts | Collects the fonts of the current browser/os.
http-assets | Collects the headers used when loading assets such as css, js, and images in a browser
http-basic-headers | Collects the headers sent by browser when requesting documents in various contexts
http-websockets | Collects the headers used when initializing and facilitating web sockets
http-xhr | Collects the headers used by browsers when facilitating XHR requests
http2-session | Collects the settings, pings and frames sent across by a browser http2 client
tcp | Collects tcp packet values such as window-size and time-to-live
tls-clienthello | Collects the TLS clienthello handshake when initiating a secure connection
http-basic-cookies | Collects a wide range of cookies configuration options and whether they're settable/gettable

### Analyze Plugins

Name | Description
--- | :---
browser-codecs | Analyzes that the audio, video and WebRTC codecs match the given user agent
browser-dom-environment | Analyzes the DOM environment, such as functionality and object structure, match the given user-agent
browser-fingerprints | Analyzes whether the browser's fingerprints leak across sessions
http-assets | Analyzes http header order, capitalization and default values for common document assets (images, fonts, media, scripts, stylesheet, etc)
http-basic-cookies | Analyzes whether cookies are enabled correctly, including same-site and secure
http-basic-headers | Analyzes header order, capitalization and default values
http-websockets | Analyzes websocket upgrade request header order, capitalization and default values
http-xhr | Analyzes header order, capitalization and default values of Xhr requests
http2-session | Analyzes http2 session settings and frames
tcp | Analyzes tcp packet values, including window-size and time-to-live
tls-clienthello | Analyzes clienthello handshake signatures, including ciphers, extensions and version

## Scraper Results:

For a dynamic approach to exploring results, visit [ScraperReport](https://scraper.report).

## Testing your Scraper:

This project leverages yarn workspaces. To get started, run `yarn` from the root directory.

If you'd like to test out your scraper stack:

1. Navigate to the `/collect-controller` directory and run `yarn start`. Follow setup directions print onto the console from this command. 

2. The API will return assignments one at a time until all tests have been run. Include a scraper engine you're testing with
   a query string or header called "scraper". Assignment format can be found at `/collect-controller/interfaces/IAssignment.ts`.

3. Once all tests are run, results will be output to the same directory as your scraper engine.

Popular scraper examples can be found in the [scraper-report](https://github.com/ulixee/scraper-report) repo.
