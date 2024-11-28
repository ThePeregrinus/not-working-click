function initQR() {
  async function prep() {
    let aspectRatio;
    let qrboxFunction = function (viewfinderWidth, viewfinderHeight) {
      aspectRatio = viewfinderWidth / viewfinderHeight;
      let minEdgePercentage = 0.7; // percentage for edge
      let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
      let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
      return {
        width: qrboxSize,
        height: qrboxSize,
      };
    };

    const formatsToSupport = [Html5QrcodeSupportedFormats.QR_CODE];

    const scanner = new Html5Qrcode("qr-reader");
    const config = {
      fps: 10, // frame per seconds for qr code scanning
      qrbox: qrboxFunction,
      aspectRatio: aspectRatio,
      formatsToSupport,
    };

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      window.location.href = `ar.html?vin=` + decodedText;
    };

    scanner
      .start(
        { facingMode: { exact: "environment" } },
        config,
        qrCodeSuccessCallback
      )
      .catch(() => {
        scanner.start(
          { facingMode: { exact: "user" } },
          config,
          qrCodeSuccessCallback
        );
      });
  }
  prep();
}

function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

if (screen.orientation) {
  if (screen.orientation.type.includes("landscape")) {
    docReady(initQR);
    console.log("QR Scanner is ready");
  } else {
    let isScriptNotFiredBefore = true;

    screen.orientation.addEventListener("change", () => {
      if (
        screen.orientation.type.includes("landscape") &&
        isScriptNotFiredBefore
      ) {
        docReady(initQR);
        isScriptNotFiredBefore = false;
        console.log("QR Scanner is ready");
      }
    });
  }
}
