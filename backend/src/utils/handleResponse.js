const handleResponse = async (req, res, fn) => {
  try {
    const result = await fn(req, res);
    return res.status(result?.status || 200).json({
      success: true,
      status: result?.status || 200,
      message: result?.message || "Success",
      data: result?.data || [],
    });
  } catch (error) {
    return res.status(error?.status || 500).json({
      success: false,
      status: error?.status || 500,
      message: error?.message || "Internal Server Error",
    });
  }
};

module.exports = handleResponse;