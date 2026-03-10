import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// PRO TIP: Replace this with your actual session logic (e.g., const session = await getServerSession())
const auth = (req: Request) => ({ id: "user_29384" }); 

export const ourFileRouter = {
  // 1. General Image Uploader (Land Gallery)
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
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),

  // 2. Profile Photo Uploader
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
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),

  // 3. Citizenship Document
  citizenship: f({
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
      return { uploadedBy: metadata.userId };
    }),

  // 4. Verification Selfie
  selfie: f({
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
      return { uploadedBy: metadata.userId };
    }),

  /**
   * 5. MALPOT PAPER UPLOADER (New)
   * Specifically for legal agreements between Landowner and Leaser.
   * Supports both Image and PDF formats for official scans.
   */
  malpotPaperUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Legal doc upload complete:", file.ufsUrl);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;