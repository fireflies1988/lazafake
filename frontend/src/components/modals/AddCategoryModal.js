import { Form, message as antMessage } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategoryAsync } from "../../features/category/categorySlice";
import { checkUploadCondition } from "../../utils";
import CategoryModal from "./CategoryModal";

function AddCategoryModal({ open, onCancel }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const { isSuccess } = useSelector((state) => state.category);

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setFileList([]);
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
        console.log("Add New Category form: ", values);

        // dispatch here
        if (fileList.length > 0 && fileList[0].file) {
          values.thumbnail = fileList[0].file;
        }

        // convert values to formData
        const formData = new FormData();
        for (let key in values) {
          formData.append(key, values[key]);
        }
        dispatch(addCategoryAsync(formData));
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  const uploadProps = {
    beforeUpload: (file) => {
      checkUploadCondition(file, antMessage);

      setFileList([
        {
          file: file,
          url: URL.createObjectURL(file),
        },
      ]);

      return false;
    },
    fileList,
    listType: "picture-card",
    name: "categoryThumbnail",
    showUploadList: {
      showRemoveIcon: false,
    },
  };

  return (
    <CategoryModal
      open={open}
      form={form}
      title="Add New Category"
      handleCancel={handleCancel}
      handleOk={handleOk}
      uploadProps={uploadProps}
    />
  );
}

export default AddCategoryModal;
