import { deleteNote } from "@/api/NoteAPI";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formData } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type NoteDetailsProps = {
  note: Note;
};

const NoteDetails = ({ note }: NoteDetailsProps) => {
  const { data, isLoading } = useAuth();

  const params = useParams();
  const projectId = params.projectId!;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;

  const queryCLiente = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryCLiente.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const canDelete = useMemo(() => data?._id === note.createBy._id, [data]);

  if (isLoading) return "Cargando...";
  return (
    <div className="p-3 flex justify-between items-center">
      <div className="">
        <p className="">
          {note.content} por:{" "}
          <span className="font-bold">{note.createBy.name}</span>
        </p>
        <p className="text-xs text-slate-500">{formData(note.createdAt)}</p>
      </div>
      {canDelete && (
        <button
          className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
          type="button"
          onClick={() => mutate({ projectId, taskId, noteId: note._id })}
        >
          Eliminar
        </button>
      )}
    </div>
  );
};

export default NoteDetails;
