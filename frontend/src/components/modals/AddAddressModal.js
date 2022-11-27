import { Form } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAddressAsync } from "../../features/address/addressSlice";
import AddressModal from "./AddressModal";

function AddAddressModal({ open, onCancel }) {
  const { isSuccess } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
    }
  }, [isSuccess]);

  function handleCancel() {
    form.resetFields();
    onCancel();
  }

  function handleOk() {
    form
      .validateFields()
      .then((values) => {
        console.log("Add New Address form: ", values);
        dispatch(addAddressAsync(values));
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  return (
    <AddressModal
      title="Add New Address"
      open={open}
      handleCancel={handleCancel}
      handleOk={handleOk}
      form={form}
    />
  );
}

export default AddAddressModal;
