import { BoardMember, Committee } from "@/types/company";
import { useState } from "react";
import Input from "../input";
import TextArea from "../textArea";
import Select from "../select";
import { X } from "lucide-react";

const CommitteeModal: React.FC<{
  committee: Committee | null;
  boardMembers: BoardMember[];
  onSave: (committee: Omit<Committee, "id">) => void;
  onCancel: () => void;
}> = ({ committee, boardMembers, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Committee, "id">>(
    committee || {
      name: "",
      purpose: "",
      chairperson: "",
      members: [],
      meetingsHeld: 0,
      meetingFrequency: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleMember = (memberName: string) => {
    setFormData({
      ...formData,
      members: formData.members.includes(memberName)
        ? formData.members.filter((m) => m !== memberName)
        : [...formData.members, memberName],
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {committee ? "Edit" : "Add"} Committee
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
            label="Committee Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Audit Committee, Risk Committee"
            required
          />

          <TextArea
            label="Purpose"
            value={formData.purpose}
            onChange={(e) =>
              setFormData({ ...formData, purpose: e.target.value })
            }
            placeholder="Describe the committee's purpose and responsibilities"
            required
          />

          <Select
            label="Chairperson"
            value={formData.chairperson}
            onChange={(e) =>
              setFormData({ ...formData, chairperson: e.target.value })
            }
            options={boardMembers.map((m) => ({
              value: m.name,
              label: m.name,
            }))}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Committee Members
            </label>
            <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
              {boardMembers.map((member) => (
                <div key={member.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={formData.members.includes(member.name)}
                    onChange={() => toggleMember(member.name)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`member-${member.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {member.name} - {member.position}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Input
            label="Meetings Held (This Period)"
            type="number"
            min="0"
            value={formData.meetingsHeld}
            onChange={(e) =>
              setFormData({ ...formData, meetingsHeld: Number(e.target.value) })
            }
            required
          />

          <Select
            label="Meeting Frequency"
            value={formData.meetingFrequency}
            onChange={(e) =>
              setFormData({ ...formData, meetingFrequency: e.target.value })
            }
            options={[
              { value: "Weekly", label: "Weekly" },
              { value: "Monthly", label: "Monthly" },
              { value: "Quarterly", label: "Quarterly" },
              { value: "Semi-Annually", label: "Semi-Annually" },
              { value: "Annually", label: "Annually" },
            ]}
            required
          />

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
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              Save Committee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CommitteeModal;
