import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";

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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
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
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="relative bg-white rounded-lg  w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 ">
            <div className="flex justify-between items-center p-6 sticky top-0 bg-white border-b">
              <h2 className="text-2xl font-bold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 ">
              {/* Product Name */}
              <div className="px-6 py-4 space-y-6">
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
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Blouses, Dresses, T-Shirts"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images & Videos *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg (main image URL)"
                    />
                    <div className="text-sm text-gray-500">
                      OR upload new files
                    </div>
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
                          ({imagePreviews.length}
                          {selectedFiles.length > 0 &&
                            ` + ${selectedFiles.length} new`}
                          ):
                        </p>
                        <div className="grid grid-cols-4 gap-4">
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

                    {imagePreviews.length === 0 &&
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
              <div className="flex justify-end space-x-4 !mt-0 p-6 border-t sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.image}
                        alt={product.name}
                      />
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{product.price}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
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
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {productsLoading && !submitLoading && (
              <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-md">
                Loading products...
              </div>
            )}

            {productsError && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                Error: {productsError}
              </div>
            )}
          </tbody>
        </table>

        {filteredProducts.length === 0 && !productsLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
