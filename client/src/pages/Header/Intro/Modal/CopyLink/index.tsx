import { useRef, useState } from "react";

const CopyLink = (): JSX.Element | null => {
  const textElementRef = useRef<HTMLInputElement>(null);
  const [copyStatus, setCopyStatus] = useState('Copy Link');
  const [support, setSupport] = useState({
    navigatorClipboard: !!navigator.clipboard,
    exec: !!document.queryCommandSupported('copy'),
  });

  const copyToClipboard = () => {
    if (!textElementRef.current) {
      return;
    }

    setTimeout(() => setCopyStatus('Copy Link'), 1000)

    // clipboard.writeText has wide but not 100% support
    // https://caniuse.com/?search=writeText
    if (support.navigatorClipboard) {
      try {
        void navigator.clipboard.writeText(textElementRef.current.value);
        return setCopyStatus('Copied!');
      } catch (e) {
        setSupport({ ...support, navigatorClipboard: false });
      }
    }
    // execCommand has > 97% support but is deprecated, use it as a fallback
    // https://caniuse.com/?search=execCommand
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
    if (!support.navigatorClipboard) {
      try {
        textElementRef.current.select();
        document.execCommand('copy');
        setCopyStatus('Copied!');
      } catch (e) {
        setSupport({ ...support, exec: false });
        setCopyStatus('Copy failed');
      }
    }
  };

  return (
    <div className="Modal__links_item" onClick={copyToClipboard}>
      {copyStatus}
      <input type="text" ref={textElementRef} value={window.location.origin} readOnly={true} />
    </div>
  );
};

export default CopyLink;
