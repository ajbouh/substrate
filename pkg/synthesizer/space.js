export const spaceURL = function (partialURL) {
    // partialURL: :http..."
    // return itself

    // partialURL: './bridge/bridge.js'
    // expected:
    // if it is running on substrate, and it is from space, there is
    // at least one slash and we remove chars after that.

    // partialURL: "/tool-call/js/commands.js"
    // expected:
    // fetch from the same spaceview we're in

    // if ?host parameter is specified, use that as host

    // partialURL: "//foo"
    // expected:
    // fetch from the top-level url, presumably outside of the current space we are serving from.

    if (/^http(s)?:\/\//.test(partialURL)) {
        return partialURL;
    }

    if (partialURL.startsWith("//")) {
        const url = new URL(document.baseURI);
        const maybeHost = url.searchParams.get("host") || url.host;
        const maybeProtocol = url.searchParams.get("proto") || url.proto;
        return `${maybeProtocol}//${maybeHost}${partialURL.substring(1)}`;
    }

    if (partialURL.startsWith("/")) {
        const url = new URL(document.baseURI);
        url.pathname = [...url.pathname.split("/").slice(0, 2), partialURL.substring(1)].join("/")
        return url.toString()
    }

    return partialURL;
}
