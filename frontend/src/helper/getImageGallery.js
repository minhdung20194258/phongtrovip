export default function getImageGallery(images = []) {
  return images.map((image) => ({
    original: image.url,
    thumbnail: image.url,
    ...image,
  }));
}
