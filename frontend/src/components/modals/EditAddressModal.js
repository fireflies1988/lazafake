import { Form } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAddressAsync } from "../../features/address/addressSlice";
import AddressModal from "./AddressModal";

function EditAddressModal({ open, onCancel, addressId }) {
  const { addresses } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(addresses.find((a) => a._id.toString() === addressId));
  }, [addressId]);

  function handleCancel() {
    form.resetFields();
    onCancel();
  }

  function handleOk() {
    form
      .validateFields()
      .then((values) => {
        console.log("Edit Address form: ", values);
        dispatch(updateAddressAsync({ addressId, addressData: values }));
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  return (
    <AddressModal
      title="Edit Address"
      open={open}
      handleCancel={handleCancel}
      handleOk={handleOk}
      form={form}
    />
  );
}

export default EditAddressModal;
