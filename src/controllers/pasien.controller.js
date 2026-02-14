import * as pasienService from "../services/pasien.service.js";

/**
 * Get all pasien
 */
export const getAllPasien = async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
    };

    const result = await pasienService.getAllPasien(filters);

    res.status(200).json({
      success: true,
      message: "Data pasien berhasil diambil",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data pasien",
      error: error.message,
    });
  }
};

/**
 * Get pasien by ID
 */
export const getPasienById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pasienService.getPasienById(id);

    res.status(200).json({
      success: true,
      message: "Data pasien berhasil diambil",
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
 * Create new pasien
 */
export const createPasien = async (req, res) => {
  try {
    const data = await pasienService.createPasien(req.body);

    res.status(201).json({
      success: true,
      message: "Pasien berhasil dibuat",
      data,
    });
  } catch (error) {
    const statusCode = error.message.includes("sudah terdaftar") ? 409 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update pasien
 */
export const updatePasien = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pasienService.updatePasien(id, req.body);

    res.status(200).json({
      success: true,
      message: "Pasien berhasil diupdate",
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
 * Delete pasien
 */
export const deletePasien = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pasienService.deletePasien(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.message.includes("tidak ditemukan") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
