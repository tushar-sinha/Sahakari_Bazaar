import { FiEdit2 } from "react-icons/fi";
import type { BusinessProfile } from "@/lib/profile-types";

type AboutDraft = {
  bio: string;
  businessType: string;
  serviceCategory?: string;
  state: string;
};

interface AboutSectionProps {
  profile: BusinessProfile;
  editable?: boolean;
  isEditing?: boolean;
  isSaving?: boolean;
  draft?: AboutDraft | null;
  onEdit?: () => void;
  onDraftChange?: (field: keyof AboutDraft, value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function AboutSection({
  profile,
  editable = false,
  isEditing = false,
  isSaving = false,
  draft = null,
  onEdit,
  onDraftChange,
  onSave,
  onCancel,
}: AboutSectionProps) {
  return (
    <div className="relative bg-[#FEF8E0] rounded-xl border border-[#B2AC88]/40 shadow-lg p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-[#2D5A27] flex items-center gap-2">
          <span>ℹ️</span> About
        </h3>
        {editable && !isEditing && onEdit ? (
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center rounded-md border border-[#B2AC88]/40 bg-[#F7F1E7] p-2 text-xs font-semibold text-[#2D5A27] transition hover:bg-[#E3DCC4]"
            aria-label="Edit about section"
          >
            <FiEdit2 size={14} />
          </button>
        ) : null}
      </div>

      {isEditing && draft && onDraftChange ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Bio
              <textarea
                value={draft.bio}
                onChange={(e) => onDraftChange("bio", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                rows={4}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#4a5f47]">
              Business Type
              <input
                type="text"
                value={draft.businessType}
                onChange={(e) => onDraftChange("businessType", e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#B2AC88]/40 bg-[#F7F1E7] px-4 py-3 text-sm text-[#2f4f2b] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#B2AC88]/30"
              />
            </label>
            <label className="block text-sm font-semibold text-[#4a5f47]">
              Specialization
              <input
                type="text"
                value={draft.serviceCategory || ""}
                onChange={(e) => onDraftChange("serviceCategory", e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#B2AC88]/40 bg-[#F7F1E7] px-4 py-3 text-sm text-[#2f4f2b] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#B2AC88]/30"
              />
            </label>
            <label className="block text-sm font-semibold text-[#4a5f47] sm:col-span-2">
              State
              <input
                type="text"
                value={draft.state}
                onChange={(e) => onDraftChange("state", e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#B2AC88]/40 bg-[#F7F1E7] px-4 py-3 text-sm text-[#2f4f2b] outline-none focus:border-[#2D5A27] focus:ring-2 focus:ring-[#B2AC88]/30"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="rounded-full border border-[#B2AC88]/40 bg-white px-4 py-2 text-sm font-semibold text-[#2f4f2b] hover:bg-[#f5f0dc] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="rounded-full bg-[#2D5A27] px-4 py-2 text-sm font-semibold text-white hover:bg-[#234a24] disabled:cursor-not-allowed disabled:bg-[#9ea58c]"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Bio</p>
            <p className="text-gray-600 leading-relaxed text-sm">{profile.bio}</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Business Type:</span>
                <span className="font-semibold text-gray-800">{profile.businessType}</span>
              </div>
              {profile.serviceCategory && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialization:</span>
                  <span className="font-semibold text-gray-800">{profile.serviceCategory}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold text-gray-800">{profile.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-semibold text-gray-800">2019</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
