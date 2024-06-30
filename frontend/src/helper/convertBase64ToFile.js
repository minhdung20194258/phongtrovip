export default function convertBase64ToFile(base64string) {
  try {
    const blobBin = atob(base64string.split(',')[1]);
    const array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
  } catch (error) {
    console.log(error);
  }
}
