import { BoardMember } from "@/types/company";
import { Calendar, X } from "lucide-react";
import { useState } from "react";
import Input from "../input";
import TextArea from "../textArea";

const BoardMemberModal: React.FC<{
  member: BoardMember | null;
  onSave: (member: Omit<BoardMember, "id">) => void;
  onCancel: () => void;
}> = ({ member, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<BoardMember, "id">>(
    member || {
      name: "",
      position: "",
      appointmentDate: "",
      qualifications: "",
      experience: "",
      isPEP: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {member ? "Edit" : "Add"} Board Member
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Position"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            placeholder="e.g., Chairman, Director, CEO"
            required
          />

          <Input
            label="Appointment Date"
            type="date"
            value={formData.appointmentDate}
            onChange={(e) =>
              setFormData({ ...formData, appointmentDate: e.target.value })
            }
            icon={Calendar}
            required
          />

          <TextArea
            label="Qualifications"
            value={formData.qualifications}
            onChange={(e) =>
              setFormData({ ...formData, qualifications: e.target.value })
            }
            placeholder="List academic and professional qualifications"
            required
          />

          <TextArea
            label="Experience"
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: e.target.value })
            }
            placeholder="Describe relevant work experience"
            required
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPEP"
              checked={formData.isPEP}
              onChange={(e) =>
                setFormData({ ...formData, isPEP: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPEP" className="ml-2 text-sm text-gray-700">
              Politically Exposed Person (PEP)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardMemberModal