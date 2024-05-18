import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";

interface IUserInfo {
    _id: string;
    fullName: string;
    email: string;
  
}

const Navbar = (userInfo : IUserInfo) => {

  const navigate = useNavigate();
  const [value, setValue] = useState<string>("");
  
  const onLogout = () => {
    localStorage.clear();
    navigate("/login")
  };

  const handleSearch = () => {

  }

  const onClearSearch = () => {
    setValue("")
  }
  
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <SearchBar value={value} onChange={(e) => setValue(e.target.value)} handleSearch={handleSearch} onClearSearch={onClearSearch}/>
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};
export default Navbar;
