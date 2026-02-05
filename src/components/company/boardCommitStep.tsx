import { BoardMember, Committee } from "@/types/company";
import CommitteeModal from "./modals/commiteeModal";
import { useState } from "react";
import { formatDate, generateId } from "@/lib/company";
import { Building2, Plus, Users } from "lucide-react";
import BoardMemberModal from "./modals/boardMemberModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BoardCommitteesStepProps {
  data: {
    boardMembers: BoardMember[];
    committees: Committee[];
  };
  onChange: (data: any) => void;
  errors: any;
}

const BoardCommitteesStep: React.FC<BoardCommitteesStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const [showBoardForm, setShowBoardForm] = useState(false);
  const [showCommitteeForm, setShowCommitteeForm] = useState(false);
  const [editingBoard, setEditingBoard] = useState<BoardMember | null>(null);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(
    null
  );

  const addBoardMember = (member: Omit<BoardMember, "id">) => {
    const newMember = { ...member, id: generateId() };
    onChange({ ...data, boardMembers: [...data.boardMembers, newMember] });
    setShowBoardForm(false);
  };

  const updateBoardMember = (id: string, member: Omit<BoardMember, "id">) => {
    onChange({
      ...data,
      boardMembers: data.boardMembers.map((m) =>
        m.id === id ? { ...member, id } : m
      ),
    });
    setEditingBoard(null);
  };

  const removeBoardMember = (id: string) => {
    onChange({
      ...data,
      boardMembers: data.boardMembers.filter((m) => m.id !== id),
    });
  };

  const addCommittee = (committee: Omit<Committee, "id">) => {
    const newCommittee = { ...committee, id: generateId() };
    onChange({ ...data, committees: [...data.committees, newCommittee] });
    setShowCommitteeForm(false);
  };

  const updateCommittee = (id: string, committee: Omit<Committee, "id">) => {
    onChange({
      ...data,
      committees: data.committees.map((c) =>
        c.id === id ? { ...committee, id } : c
      ),
    });
    setEditingCommittee(null);
  };

  const removeCommittee = (id: string) => {
    onChange({
      ...data,
      committees: data.committees.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-500" />
            Board Members
          </h2>
          <button
            type="button"
            onClick={() => setShowBoardForm(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </button>
        </div>

        {errors?.boardMembers && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.boardMembers}
          </div>
        )}

        {data.boardMembers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No board members added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.boardMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.position}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Appointed: {formatDate(member.appointmentDate)}
                    {member.isPEP && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        PEP
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingBoard(member)}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBoardMember(member.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Committees Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-green-500" />
            Committees
          </h2>
          <button
            type="button"
            onClick={() => setShowCommitteeForm(true)}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Committee
          </button>
        </div>

        {errors?.committees && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.committees}
          </div>
        )}

        {data.committees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No committees added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.committees.map((committee) => (
              <div
                key={committee.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">
                    {committee.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Chair: {committee.chairperson}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {committee.members.length} members •{" "}
                    {committee.meetingsHeld} meetings held •{" "}
                    {committee.meetingFrequency}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingCommittee(committee)}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCommittee(committee.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Board Member Dialog */}
      <Dialog
        open={showBoardForm || !!editingBoard}
        onOpenChange={(open) => {
          if (!open) {
            setShowBoardForm(false);
            setEditingBoard(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBoard ? "Edit Board Member" : "Add Board Member"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <BoardMemberModal
              member={editingBoard}
              onSave={(member) => {
                if (editingBoard) {
                  updateBoardMember(editingBoard.id, member);
                } else {
                  addBoardMember(member);
                }
              }}
              onCancel={() => {
                setShowBoardForm(false);
                setEditingBoard(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Committee Dialog */}
      <Dialog
        open={showCommitteeForm || !!editingCommittee}
        onOpenChange={(open) => {
          if (!open) {
            setShowCommitteeForm(false);
            setEditingCommittee(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCommittee ? "Edit Committee" : "Add Committee"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <CommitteeModal
              committee={editingCommittee}
              boardMembers={data.boardMembers}
              onSave={(committee) => {
                if (editingCommittee) {
                  updateCommittee(editingCommittee.id, committee);
                } else {
                  addCommittee(committee);
                }
              }}
              onCancel={() => {
                setShowCommitteeForm(false);
                setEditingCommittee(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardCommitteesStep;
