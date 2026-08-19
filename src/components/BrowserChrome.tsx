/** Host shown in the fake browser bar — honest about where the demo lives. */
function hostOf(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="demo__chrome">
      <i /><i /><i />
      <span className="demo__url mono">{hostOf(url)}</span>
    </div>
  );
}
