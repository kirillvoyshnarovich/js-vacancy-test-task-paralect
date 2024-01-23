import config from 'config';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { 
  getStorage, 
  ref, 
  FirebaseStorage, 
  uploadBytes, 
  getDownloadURL, 
  StorageReference,
  list,
  deleteObject,
} from 'firebase/storage';
import { FirebaseConfig } from './firebase.types';
import { File } from '@koa/multer';
import logger from 'logger';

const imagesPath = '/productsImage';

const fireBaseConf = {
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID,
};

class StorageService {
  apiKey: string | undefined;

  app: FirebaseApp;

  fileStorage: FirebaseStorage;

  storageProduct: StorageReference;

  constructor(conf: FirebaseConfig) {

    this.app = initializeApp(conf);
    this.fileStorage = getStorage(this.app);
    this.storageProduct = ref(this.fileStorage);
  }
  
  async uploadImage(file: File, fileName: string) {
    let byteFile: Uint8Array;
    let snapshotImage: any; 
    const imageRef = ref(this.storageProduct, `${imagesPath}/${fileName}`);
    const metadata = {
      contentType: file.mimetype,
      name: fileName,
    };
    try {
      byteFile = new Uint8Array(file.buffer);

      snapshotImage = await uploadBytes(imageRef, byteFile, metadata);
      const imageUrl = await getDownloadURL(snapshotImage.ref);

      return imageUrl;
    } catch (e) {
      logger.error(`Error convert file: ${e}`);
    }

  }
  
  async getImage(imageUrl: string) {
    let url: string | null = null;

    try {
      url = await getDownloadURL(ref(this.storageProduct, `/${imageUrl}`));
    } catch (e) {
      logger.error(`Image doesn't exist: ${e}`);
    }

    return url;
  }

  async getImages() {
    const imagesProductRef = ref(this.storageProduct, `/${imagesPath}`);
    const firstPage = await list(imagesProductRef, { maxResults: 10 });
  }

  async getPlaceholderImage(): Promise<string> {
    return getDownloadURL(ref(this.storageProduct.root, 'placeholder-product-image.png'));
  }

  async removeImage(url: string) {
    const refUrl = ref(this.fileStorage, `${url}`);
    return deleteObject(refUrl);
  }
}

export default new StorageService(fireBaseConf as FirebaseConfig);