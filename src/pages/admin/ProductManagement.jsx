import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { PRODUCT_CATEGORIES } from "../../utils/constants";
import LoadingSpinner from "../../components/LoadingSpinner";

const ProductManagement = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    productsLoading,
    productsError,
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    image: "",
    colors: [],
    sizes: ["S", "M", "L", "XL"],
    category: "",
    isFeatured: false,
    inventory: {
      stock: 0,
    },
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);

      // Generate previews for all selected files
      const previews = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push({
            url: e.target.result,
            type: file.type.startsWith("video/") ? "video" : "image",
            name: file.name,
          });

          // Update state when all previews are loaded
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationAttempted(true);
    setSubmitLoading(true);

    try {
      // Validate that we have images
      if (selectedFiles.length === 0 && !formData.image) {
        alert(
          "Please provide an image URL or upload at least one image/video file"
        );
        setSubmitLoading(false);
        return;
      }

      // Clean up colors array to remove empty strings
      const cleanedFormData = {
        ...formData,
        colors: formData.colors.filter((color) => color.trim() !== ""),
        imageFiles: selectedFiles, // Pass array of files
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, cleanedFormData);
      } else {
        await addProduct(cleanedFormData);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting product:", error);
      alert(error.message || "Failed to save product");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    const editFormData = {
      name: product.name,
      description: product.description || "",
      price: product.price,
      originalPrice: product.originalPrice || "",
      image: product.image,
      colors: product.colors || [],
      sizes: product.sizes || ["S", "M", "L", "XL"],
      category: product.category,
      isFeatured: product.isFeatured || false,
      inventory: {
        stock: product.inventory?.stock || 0,
      },
      existingImages: product.images || [], // Store existing additional images
    };

    setFormData(editFormData);

    // Build preview array with all existing images
    const existingPreviews = [];

    // Add main image first
    if (product.image) {
      existingPreviews.push({
        url: product.image,
        type: product.image.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image",
        name: "Main Image",
        isExisting: true,
        isMain: true,
      });
    }

    // Add additional images/videos
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img, index) => {
        const mediaUrl = img.url || img;
        existingPreviews.push({
          url: mediaUrl,
          type: mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image",
          name: img.alt || `Image ${index + 2}`,
          isExisting: true,
          isMain: false,
        });
      });
    }

    setImagePreviews(existingPreviews);
    setSelectedFiles([]);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      image: "",
      colors: [],
      sizes: ["S", "M", "L", "XL"],
      category: "",
      isFeatured: false,
      inventory: {
        stock: 0,
      },
      existingImages: [],
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setEditingProduct(null);
    setShowForm(false);
    setValidationAttempted(false);
  };

  const handleColorChange = (index, value) => {
    const newColors = [...formData.colors];
    newColors[index] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const addColor = () => {
    setFormData({ ...formData, colors: [...formData.colors, ""] });
  };

  const removeColor = (index) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: newColors });
  };

  const handleSizeToggle = (size) => {
    const newSizes = formData.sizes.includes(size)
      ? formData.sizes.filter((s) => s !== size)
      : [...formData.sizes, size];
    setFormData({ ...formData, sizes: newSizes });
  };

  // Helper function to detect if URL is a video
  const isVideoUrl = (url) => {
    if (!url) return false;
    // Check if it's a Cloudinary video URL
    if (url.includes("/video/upload/")) return true;
    // Check file extension
    if (url.match(/\.(mp4|webm|ogg|mov|avi)$/i)) return true;
    return false;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Product Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 shadow-md transition-all duration-200 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search products..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-4 sm:p-6 sticky top-0 bg-white border-b z-10 rounded-t-xl">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div className="px-4 sm:px-6 py-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Silk Cami Blouse"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Product description..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="">Select a category...</option>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images & Videos *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    />
                    <p className="text-xs text-gray-500">
                      {editingProduct
                        ? "Upload new files to add or replace existing images (first image will be the main product image)"
                        : "Select multiple images and videos (first image will be the main product image)"}
                    </p>

                    {/* Preview Section */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {editingProduct
                            ? "Current & New Images"
                            : "Selected Files"}{" "}
                          ( ):
                        </p>
                        <div className="grid grid-cols-4 gap-4 px-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              {preview.type === "video" ? (
                                <video
                                  src={preview.url}
                                  className="h-24 w-full object-cover rounded-lg border border-gray-300"
                                  muted
                                />
                              ) : (
                                <img
                                  src={preview.url}
                                  alt={`Preview ${index + 1}`}
                                  className="h-24 w-full object-cover rounded-lg border border-gray-300"
                                />
                              )}

                              {/* Badges */}
                              <div className="absolute top-1 right-1 flex gap-1">
                                {preview.isMain && (
                                  <div className="bg-pink-500 text-white text-xs px-2 py-1 rounded">
                                    Main
                                  </div>
                                )}
                                {preview.isExisting && (
                                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                    Current
                                  </div>
                                )}
                              </div>

                              {/* Index badge */}
                              {!preview.isMain && (
                                <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                  #{index + 1}
                                </div>
                              )}

                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const newPreviews = imagePreviews.filter(
                                    (_, i) => i !== index
                                  );
                                  setImagePreviews(newPreviews);

                                  // If it's a newly uploaded file, also remove from selectedFiles
                                  if (!preview.isExisting) {
                                    const newFileIndex = imagePreviews
                                      .slice(0, index)
                                      .filter((p) => !p.isExisting).length;
                                    const newFiles = selectedFiles.filter(
                                      (_, i) => i !== newFileIndex
                                    );
                                    setSelectedFiles(newFiles);
                                  }
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {validationAttempted &&
                      imagePreviews.length === 0 &&
                      selectedFiles.length === 0 &&
                      !formData.image &&
                      !editingProduct && (
                        <p className="text-sm text-red-500">
                          Please provide an image URL or upload files
                        </p>
                      )}
                  </div>
                </div>

                {/* Price & Original Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    value={formData.inventory.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        inventory: {
                          ...formData.inventory,
                          stock: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>

                {/* Colors */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Colors
                    </label>
                    <button
                      type="button"
                      onClick={addColor}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      + Add Color
                    </button>
                  </div>
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        value={color}
                        onChange={(e) =>
                          handleColorChange(index, e.target.value)
                        }
                        placeholder={`Color ${
                          index + 1
                        } (e.g., pink, white, black)`}
                      />
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-4 py-2 border rounded-md ${
                          formData.sizes.includes(size)
                            ? "bg-pink-500 text-white border-pink-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-pink-500"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked,
                        })
                      }
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Featured Product
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 !mt-0 p-4 sm:p-6 border-t sticky bottom-0 bg-white rounded-b-xl">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors w-full sm:w-auto"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md w-full sm:w-auto"
                  disabled={submitLoading}
                >
                  {submitLoading
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50">
              <tr>
                <th className="px-3 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Sr No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className="hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-transparent transition-all duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {startIndex + index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden ring-2 ring-pink-100">
                        {isVideoUrl(product.image) ? (
                          <video
                            src={product.image}
                            className="h-10 w-10 object-cover"
                            muted
                          />
                        ) : (
                          <img
                            className="h-10 w-10 object-cover"
                            src={product.image}
                            alt={product.name}
                          />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-pink-600">
                      ₹{product.price}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="ml-2 text-xs text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.inventory?.stock || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.isFeatured && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Featured
                      </span>
                    )}
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          On Sale
                        </span>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-pink-600 hover:text-pink-700 hover:bg-pink-100 rounded-lg transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this product?"
                            )
                          ) {
                            deleteProduct(product._id);
                          }
                        }}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {productsLoading && !submitLoading && (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              )}

              {productsError && (
                <tr>
                  <td colSpan="7" className="p-4">
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-center">
                      Error: {productsError}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredProducts.length > 0 && !productsLoading && (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-pink-50/30 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page Info */}
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{startIndex + 1}</span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(endIndex, filteredProducts.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{filteredProducts.length}</span>{" "}
                products
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && !productsLoading && (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-pink-50/30">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
