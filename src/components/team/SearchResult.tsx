import { addUserToProject } from "@/api/TeamAPI";
import { TeamMember } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

type SearchResultProps = {
  user: TeamMember;
  reset: () => void;
};

const SearchResult = ({ user, reset }: SearchResultProps) => {
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
    },
  });

  const handleAddUserToProject = () => {
    const data = { projectId, id: user._id };
    mutate(data);
  };

  return (
    <>
      <p className="mt-10 font-bold text-center">Resultado:</p>
      <div className="flex items-center justify-between">
        <p>{user.name}</p>
        <button
          className="px-10 py-3 font-bold text-purple-600 cursor-pointer hover:bg-purple-100"
          onClick={handleAddUserToProject}
        >
          Agregar al Proyecto
        </button>
      </div>
    </>
  );
};

export default SearchResult;
