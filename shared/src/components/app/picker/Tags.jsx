import RNPicker from "./RNPicker";

const Tags = ({ selectedValue, setPick, onClose, onBlur, tags }) => {
  return (
    <RNPicker
      selectedValue={selectedValue}
      setPick={setPick}
      onClose={onClose}
      onBlur={onBlur}
      data={tags}
    />
  );
};

export default Tags;
