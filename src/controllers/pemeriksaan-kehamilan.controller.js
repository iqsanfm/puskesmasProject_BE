import * as pemeriksaanKehamilanService from "../services/pemeriksaan-kehamilan.service.js";
import prisma from "../../lib/prisma.js";

/**
 * Get all pemeriksaan kehamilan
 */
export const getAllPemeriksaanKehamilan = async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      practice_id: req.query.practice_id,
      pasien_id: req.query.pasien_id,
      tanggal_start: req.query.tanggal_start,
      tanggal_end: req.query.tanggal_end,
      resti: req.query.resti,
      search: req.query.search,
    };

    // If user is bidan_praktik, only show their own data
    if (req.user.position_user === "bidan_praktik") {
      const practicePlace = await prisma.practice_place.findUnique({
        where: { user_id: req.user.user_id },
      });

      if (practicePlace) {
        filters.practice_id = practicePlace.practice_id;
      }
    }

    const result =
      await pemeriksaanKehamilanService.getAllPemeriksaanKehamilan(filters);

    res.status(200).json({
      success: true,
      message: "Data pemeriksaan kehamilan berhasil diambil",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data pemeriksaan kehamilan",
      error: error.message,
    });
  }
};

/**
 * Get pemeriksaan kehamilan by ID
 */
export const getPemeriksaanKehamilanById = async (req, res) => {
  try {
    const { id } = req.params;
    const data =
      await pemeriksaanKehamilanService.getPemeriksaanKehamilanById(id);

    res.status(200).json({
      success: true,
      message: "Data pemeriksaan kehamilan berhasil diambil",
      data,
    });
  } catch (error) {
    const statusCode = error.message.includes("tidak ditemukan") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Create new pemeriksaan kehamilan
 */
export const createPemeriksaanKehamilan = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const data = await pemeriksaanKehamilanService.createPemeriksaanKehamilan(
      req.body,
      userId,
    );

    res.status(201).json({
      success: true,
      message: "Data pemeriksaan kehamilan berhasil dibuat",
      data,
    });
  } catch (error) {
    const statusCode = error.message.includes("tidak ditemukan") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update pemeriksaan kehamilan
 */
export const updatePemeriksaanKehamilan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const data = await pemeriksaanKehamilanService.updatePemeriksaanKehamilan(
      id,
      req.body,
      userId,
    );

    res.status(200).json({
      success: true,
      message: "Data pemeriksaan kehamilan berhasil diupdate",
      data,
    });
  } catch (error) {
    const statusCode = error.message.includes("tidak ditemukan") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete pemeriksaan kehamilan
 */
export const deletePemeriksaanKehamilan = async (req, res) => {
  try {
    const { id } = req.params;
    const result =
      await pemeriksaanKehamilanService.deletePemeriksaanKehamilan(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.message.includes("tidak ditemukan") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
