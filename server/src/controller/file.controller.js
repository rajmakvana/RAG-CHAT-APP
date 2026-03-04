import prisma from "../config/dataBase.js";
import { chunkText } from "../utils/chunking.js";
import { extractPdfText } from "../utils/parsePdf.js";
import cloudinary from "../config/cloudinary.js";
import { storeChunkInPinecone } from "../services/storeVectors.js";
import { deleteVectorsByNamespace } from "../services/deleteVectors.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    const parsedPdf = await extractPdfText(file.buffer); // pdf parsing
    const chunks = await chunkText(parsedPdf); // chunking text

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "rag-datasets",
            use_filename: true,
            filename_override: req.file.originalname,
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(file.buffer);
    });

    await prisma.dataset.create({
      data: {
        filename: result.original_filename || `${result.public_id}.${result.format}`,
        url: result.secure_url,
        uploadedById: req.user.id,
        publicId: result.public_id,
        organizationId: req.user.organizationId || undefined,
      },
    });

    await storeChunkInPinecone(chunks, req.user.organizationId);

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

// #5 — Delete a dataset (remove from Cloudinary + Pinecone + DB)
export const deleteDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const orgId = req.user.organizationId;

    const dataset = await prisma.dataset.findFirst({
      where: {
        id: datasetId,
        organizationId: orgId || undefined,
      },
    });

    if (!dataset) {
      return res.status(404).json({ success: false, message: "Dataset not found" });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(dataset.publicId, { resource_type: "raw" });
    } catch (cloudErr) {
      console.error("Cloudinary delete error (non-fatal):", cloudErr);
    }

    // Delete from database
    await prisma.dataset.delete({ where: { id: datasetId } });

    res.json({ success: true, message: "Dataset deleted successfully" });
  } catch (error) {
    console.error("Delete dataset error:", error);
    res.status(500).json({ success: false, message: "Failed to delete dataset" });
  }
};
