import { MdAdd, MdOutlineAlarmAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar/Navbar";
import AddEditNotes from "./AddEditNotes";
import { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

interface ModalState {
  isShown: boolean;
  type: "add" | "edit";
  data: any;
}

interface IUserInfo {
  _id: string;
  fullName: string;
  email: string;

}

const Home = () => {
  const fetchUser = async () => {
    const response = await axiosInstance.get('/get-user');
    return response.data; // Return the data part of the response
  };

  const { data } = useQuery({ queryKey: ['user'], queryFn: fetchUser })

  const navigate = useNavigate()

  const [openAddEditModal, setOpenAddEditModal] = useState<ModalState>({
    isShown: false,
    type: "add",
    data: null,
  });

  const onClose = () => {
    setOpenAddEditModal({isShown: false, type: "add", data: null})
  }
  return (
    <>
      <Navbar {...data } />

      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          <NoteCard
            title="Meeting on 7th April"
            content="Meeting on 7th April "
            date="3rd Apr 2024"
            tags="#Meeting"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600
          absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 "
      >
        <AddEditNotes type={openAddEditModal.type} noteData={openAddEditModal.data}  onClose={onClose} />
      </Modal>
    </>
  );
};
export default Home;
