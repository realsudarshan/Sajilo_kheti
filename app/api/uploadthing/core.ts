import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for uploading many images
export const manyImageRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Multiple images upload complete for userId:", metadata.userId);
      console.log("File details:", file.type);
      console.log("Date", new Date());
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

// FileRouter for uploading single image
export const singleImageRouter = {
  photoUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Single image upload complete for userId:", metadata.userId);
      console.log("File details:", file.type);
      console.log("Date", new Date());
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;


export const CitizenshipfrontpicRouter = {
  photoUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Single image upload complete for userId:", metadata.userId);
      console.log("File details:", file.type);
      console.log("Date", new Date());
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export const CitizenshipbackpicRouter = {
  photoUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Single image upload complete for userId:", metadata.userId);
      console.log("File details:", file.type);
      console.log("Date", new Date());
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
export type CitizenshipfrontpicRouter = typeof CitizenshipfrontpicRouter;
export type CitizenshipbackpicRouter = typeof CitizenshipbackpicRouter;
export type ManyImageRouter = typeof manyImageRouter;
export type SingleImageRouter = typeof singleImageRouter;
