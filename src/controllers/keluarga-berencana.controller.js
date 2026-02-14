import * as keluargaBerencanaService from "../services/keluarga-berencana.service.js";
import prisma from "../../lib/prisma.js";

/**
 * Get all keluarga berencana
 */
export const getAllKeluargaBerencana = async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      practice_id: req.query.practice_id,
      pasien_id: req.query.pasien_id,
      tanggal_start: req.query.tanggal_start,
      tanggal_end: req.query.tanggal_end,
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
      await keluargaBerencanaService.getAllKeluargaBerencana(filters);

    res.status(200).json({
      success: true,
      message: "Data keluarga berencana berhasil diambil",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data keluarga berencana",
      error: error.message,
    });
  }
};

/**
 * Get keluarga berencana by ID
 */
export const getKeluargaBerencanaById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await keluargaBerencanaService.getKeluargaBerencanaById(id);

    res.status(200).json({
      success: true,
      message: "Data keluarga berencana berhasil diambil",
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
 * Create new keluarga berencana
 */
export const createKeluargaBerencana = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const data = await keluargaBerencanaService.createKeluargaBerencana(
      req.body,
      userId,
    );

    res.status(201).json({
      success: true,
      message: "Data keluarga berencana berhasil dibuat",
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
 * Update keluarga berencana
 */
export const updateKeluargaBerencana = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const data = await keluargaBerencanaService.updateKeluargaBerencana(
      id,
      req.body,
      userId,
    );

    res.status(200).json({
      success: true,
      message: "Data keluarga berencana berhasil diupdate",
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
 * Delete keluarga berencana
 */
export const deleteKeluargaBerencana = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await keluargaBerencanaService.deleteKeluargaBerencana(id);

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
