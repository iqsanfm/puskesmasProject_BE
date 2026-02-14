import * as persalinanService from "../services/persalinan.service.js";
import prisma from "../../lib/prisma.js";

/**
 * Get all persalinan
 */
export const getAllPersalinan = async (req, res) => {
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

    const result = await persalinanService.getAllPersalinan(filters);

    res.status(200).json({
      success: true,
      message: "Data persalinan berhasil diambil",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data persalinan",
      error: error.message,
    });
  }
};

/**
 * Get persalinan by ID
 */
export const getPersalinanById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await persalinanService.getPersalinanById(id);

    res.status(200).json({
      success: true,
      message: "Data persalinan berhasil diambil",
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
 * Create new persalinan
 */
export const createPersalinan = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const data = await persalinanService.createPersalinan(req.body, userId);

    res.status(201).json({
      success: true,
      message: "Data persalinan berhasil dibuat",
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
 * Update persalinan
 */
export const updatePersalinan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const data = await persalinanService.updatePersalinan(id, req.body, userId);

    res.status(200).json({
      success: true,
      message: "Data persalinan berhasil diupdate",
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
 * Delete persalinan
 */
export const deletePersalinan = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await persalinanService.deletePersalinan(id);

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
