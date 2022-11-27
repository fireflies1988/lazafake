import { Form, message as antMessage } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCategoryAsync } from "../../features/category/categorySlice";
import { checkUploadCondition } from "../../utils";
import CategoryModal from "./CategoryModal";

function EditCategoryModal({ open, onCancel, categoryId }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  const { categories, isSuccess } = useSelector((state) => state.category);

  console.log(fileList);
  useEffect(() => {
    const category = categories.find((c) => c._id.toString() === categoryId);
    if (category) {
      form.setFieldValue("name", category?.name);
      if (category?.thumbnail?.url) {
        setFileList([
          {
            url: category?.thumbnail?.url,
          },
        ]);
      }
    }

    if (open === false) {
      setFileList([]);
    }
  }, [categoryId, open]);

  // prevent reupload cloudinary
  useEffect(() => {
    if (isSuccess) {
      if (fileList.length > 0) {
        setFileList((fileList) => [{ url: fileList[0]?.url }]);
      }
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
        console.log("Edit Category form: ", values);

        // dispatch here
        if (fileList.length > 0 && fileList[0].file) {
          values.thumbnail = fileList[0].file;
          console.log("hello");
        }
        const formData = new FormData();
        for (let key in values) {
          formData.append(key, values[key]);
        }
        dispatch(updateCategoryAsync({ categoryId, formData }));
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

export default EditCategoryModal;
