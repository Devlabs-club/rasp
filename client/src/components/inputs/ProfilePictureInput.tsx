interface InputProps {
  label: string;
  name: string;
  setPhoto: (photo: any) => void;
}

const ProfilePictureInput: React.FC<InputProps> = ({ label, name, setPhoto }) => {
  const convertToBase64 = (e: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setPhoto(reader.result);
    }
    reader.onerror = (error) => {
      console.log('Error: ', error);
    }
  }

  return (
    <div>
      <div className='flex flex-col gap-2'>
      <label htmlFor={name} className='text-white'>{label}</label>
      <input 
        type="file" 
        accept="photo/*" 
        onChange={convertToBase64} 
        id={name}
        name={name}
        className="bg-neutral-800 p-3 text-neutral-200 rounded-md" 
      />
    </div>
    </div>
  );
};

export default ProfilePictureInput;
