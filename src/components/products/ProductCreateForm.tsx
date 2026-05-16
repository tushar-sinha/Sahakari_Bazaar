"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { Category } from "@/lib/types";

interface ProductCreateFormProps {
  categories: Category[];
}

export function ProductCreateForm({ categories }: ProductCreateFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [mrp, setMrp] = useState("0");
  const [unit, setUnit] = useState("1 kg");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [inStock, setInStock] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    if (!name.trim() || !image.trim() || !categoryId) {
      setError("Please complete the name, image, and category fields.");
      setSaving(false);
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      mrp: Number(mrp),
      unit: unit.trim(),
      image: image.trim(),
      categoryId,
      inStock,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Failed to create product.");
      }

      toast.success("Product created successfully!");
      router.push(`/products/${result.product.slug}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 bg-white rounded-3xl border border-gray-200 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Product Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
            placeholder="Fresh mangoes"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Image URL</span>
          <input
            value={image}
            onChange={(event) => setImage(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
            placeholder="https://..."
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Price</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">MRP</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={mrp}
            onChange={(event) => setMrp(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Unit</span>
          <input
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
            placeholder="1 kg"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Category</span>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Availability</span>
          <select
            value={inStock ? "in-stock" : "out-of-stock"}
            onChange={(event) => setInStock(event.target.value === "in-stock")}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          >
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-gray-700">Description</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          placeholder="Share product details, origin, and quality notes."
        />
      </label>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 transition"
      >
        {saving ? "Creating product..." : "Create Product"}
      </button>
    </form>
  );
}
