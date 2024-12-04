navigator.permissions
  .query({ name: "camera" })
  .then((permissionObj) => {
    console.log(permissionObj.state);
  })
  .catch((error) => {
    console.log("Got error :", error);
  });

function initQR() {
  const height = screen.height;
  const width = screen.width;

  async function prep() {
    const aspectRatio = width / height;

    const formatsToSupport = [Html5QrcodeSupportedFormats.QR_CODE];

    const scanner = new Html5Qrcode("qr-reader");
    const config = {
      fps: 10, // frame per seconds for qr code scanning
      qrbox: 3000,
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

    window.addEventListener("resize", () => {
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
