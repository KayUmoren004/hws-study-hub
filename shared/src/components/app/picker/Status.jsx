import RNPicker from "./RNPicker";

const Status = ({ selectedValue, setPick, onClose, onBlur, status }) => {
  return (
    <RNPicker
      selectedValue={selectedValue}
      setPick={setPick}
      onClose={onClose}
      onBlur={onBlur}
      data={status}
    />
  );
};

export default Status;
