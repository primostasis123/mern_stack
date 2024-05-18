import { getInitials } from "../../utils/helper";

interface IUserInfo {
  _id: string;
  fullName: string;
  email: string;
}

interface IProfileInfoProps {
  userInfo: IUserInfo;
  onLogout: () => void;
}

const ProfileInfo = ({ userInfo, onLogout }: IProfileInfoProps) => {
  return (
    <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
              {getInitials(userInfo.fullName)}
          </div>
      <div>
        <p className="text-sm font-medium">{userInfo.fullName}</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};
export default ProfileInfo;
