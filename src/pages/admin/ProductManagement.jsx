// src/admin/pages/ProductManagement.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } =
    useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    image: "",
    colors: ["pink"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: 0,
    isSale: false,
    // Enhanced product details
    productDetails: {
      description: {
        text: "",
        styleTip: {
          title: "Style Tip:",
          content: "",
        },
        features: [""],
        additionalInfo: "",
      },
      details: {
        material: "",
        care: "",
        fit: "",
        origin: "",
        modelInfo: "",
        skuPrefix: "",
      },
      artist: {
        name: "",
        title: "",
        experience: "",
        collection: "",
        philosophy: "",
        quote: "",
        initials: "",
      },
    },
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files); // Convert FileList to an array
    setSelectedFiles(fileArray);

    // Create preview URLs for each file
    const previewUrls = fileArray.map((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        return e.target.result;
      };
      reader.readAsDataURL(file);
      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });
    });

    Promise.all(previewUrls).then((urls) => {
      setImagePreview(urls.join(","));
      setFormData({ ...formData, image: urls.join(",") });
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean up features array to remove empty strings
    const cleanedFormData = {
      ...formData,
      productDetails: {
        ...formData.productDetails,
        description: {
          ...formData.productDetails.description,
          features: formData.productDetails.description.features.filter(
            (feature) => feature.trim() !== ""
          ),
        },
      },
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, cleanedFormData);
    } else {
      addProduct({ ...cleanedFormData, id: Date.now() });
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    // Ensure the product has all the required structure
    const fullProductData = {
      ...product,
      productDetails: product.productDetails || {
        description: {
          text: "",
          styleTip: { title: "Style Tip:", content: "" },
          features: [""],
          additionalInfo: "",
        },
        details: {
          material: "",
          care: "",
          fit: "",
          origin: "",
          modelInfo: "",
          skuPrefix: "",
        },
        artist: {
          name: "",
          title: "",
          experience: "",
          collection: "",
          philosophy: "",
          quote: "",
          initials: "",
        },
      },
    };
    setFormData(fullProductData);
    setImagePreview(product.image || "");
    setSelectedFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      image: "",
      colors: ["pink"],
      sizes: ["S", "M", "L", "XL"],
      rating: 4.5,
      reviews: 0,
      isSale: false,
      productDetails: {
        description: {
          text: "",
          styleTip: {
            title: "Style Tip:",
            content: "",
          },
          features: [""],
          additionalInfo: "",
        },
        details: {
          material: "",
          care: "",
          fit: "",
          origin: "",
          modelInfo: "",
          skuPrefix: "",
        },
        artist: {
          name: "",
          title: "",
          experience: "",
          collection: "",
          philosophy: "",
          quote: "",
          initials: "",
        },
      },
    });
    setSelectedFile(null);
    setImagePreview("");
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleArrayChange = (path, index, value) => {
    const newFormData = { ...formData };
    const pathArray = path.split(".");
    let current = newFormData;

    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }

    const finalKey = pathArray[pathArray.length - 1];
    current[finalKey][index] = value;

    setFormData(newFormData);
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      productDetails: {
        ...formData.productDetails,
        description: {
          ...formData.productDetails.description,
          features: [...formData.productDetails.description.features, ""],
        },
      },
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.productDetails.description.features.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      productDetails: {
        ...formData.productDetails,
        description: {
          ...formData.productDetails.description,
          features: newFeatures,
        },
      },
    });
  };

  const handleNestedChange = (path, value) => {
    const pathArray = path.split(".");
    const newFormData = { ...formData };
    let current = newFormData;

    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }

    current[pathArray[pathArray.length - 1]] = value;
    setFormData(newFormData);
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

      {/* Enhanced Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-6">
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

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Image *
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        multiple
                        required={!editingProduct}
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Reviews
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.reviews}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reviews: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      checked={formData.isSale}
                      onChange={(e) =>
                        setFormData({ ...formData, isSale: e.target.checked })
                      }
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      On Sale
                    </span>
                  </label>
                </div>
              </div>

              {/* Product Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Product Description
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Description
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.description.text}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.description.text",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Information
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.description.additionalInfo}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.description.additionalInfo",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Style Tip Content
                    </label>
                    <textarea
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={
                        formData.productDetails.description.styleTip.content
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.description.styleTip.content",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Key Features
                      </label>
                      <button
                        type="button"
                        onClick={addFeature}
                        className="text-sm text-pink-600 hover:text-pink-700"
                      >
                        + Add Feature
                      </button>
                    </div>
                    {formData.productDetails.description.features.map(
                      (feature, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            value={feature}
                            onChange={(e) =>
                              handleArrayChange(
                                "productDetails.description.features",
                                index,
                                e.target.value
                              )
                            }
                            placeholder={`Feature ${index + 1}`}
                          />
                          {formData.productDetails.description.features.length >
                            1 && (
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="px-2 py-1 text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Product Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.details.material}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.details.material",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Care Instructions
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.details.care}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.details.care",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fit
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.details.fit}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.details.fit",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Origin
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.details.origin}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.details.origin",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model Information
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.details.modelInfo}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.details.modelInfo",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU Prefix
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.details.skuPrefix}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.details.skuPrefix",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Artist Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Artist Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Artist Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.artist.name}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.artist.name",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Artist Title
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.artist.title}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.artist.title",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.artist.experience}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.artist.experience",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Collection
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.artist.collection}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.artist.collection",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Artist Initials
                    </label>
                    <input
                      type="text"
                      maxLength="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.artist.initials}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.artist.initials",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Artist Philosophy
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.artist.philosophy}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.artist.philosophy",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Artist Quote
                    </label>
                    <textarea
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={formData.productDetails.artist.quote}
                      onChange={(e) =>
                        handleNestedChange(
                          "productDetails.artist.quote",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
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
                Price
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
              <tr key={product.id}>
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
                  ₹{product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.isSale
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.isSale ? "On Sale" : "Regular"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
