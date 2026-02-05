import { FileText, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";

interface DocumentUploadStepProps {
  files: File[];
  onChange: (files: File[]) => void;
  errors: any;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  files,
  onChange,
  errors,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.value = "";
    }
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      onChange([...files, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(ext || "")) return "📄";
    if (["doc", "docx"].includes(ext || "")) return "📝";
    if (["xls", "xlsx", "csv"].includes(ext || "")) return "📊";
    if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) return "🖼️";
    return "📎";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
          <Upload className="w-6 h-6 mr-2 text-blue-500" />
          Supporting Documents
        </h2>

        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              Required Documents:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Audited Financial Statements</li>
              <li>• Board Meeting Minutes</li>
              <li>• Committee Meeting Minutes</li>
              <li>• Product Documentation</li>
              <li>• Client Agreements (if applicable)</li>
              <li>• Capital Adequacy Calculation Worksheets</li>
            </ul>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-500">
                Supports: PDF, Word, Excel, CSV, Images (Max 10MB per file)
              </p>
            </label>
          </div>

          {errors?.supportingDocuments && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.supportingDocuments}
            </div>
          )}
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Uploaded Files ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="text-2xl mr-3">
                      {getFileIcon(file.name)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} •{" "}
                        {file.type || "Unknown type"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No files uploaded yet</p>
          </div>
        )}
      </div>

      {/* Upload Guidelines */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Upload Guidelines
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            • Ensure all financial documents are properly audited and signed
          </p>
          <p>• Board and committee minutes should be officially approved</p>
          <p>• Documents should be clear and legible</p>
          <p>
            • File names should be descriptive (e.g.,
            &quot;Board_Minutes_Q1_2024.pdf&quot;)
          </p>
          <p>• Maximum file size: 10MB per document</p>
          <p>• Supported formats: PDF (preferred), Word, Excel, Images</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadStep