import multer from "multer";

const inMemoryStorage = multer.memoryStorage();

export const upload = multer({ storage: inMemoryStorage }).single("image");

