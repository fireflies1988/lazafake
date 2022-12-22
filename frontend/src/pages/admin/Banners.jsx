import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, message as antMessage, Space, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBannersAsync,
  reset,
  updateBannersAsync,
} from "../../features/banner/bannerSlice";
import { showError } from "../../utils";

function Banners() {
  const [fileList, setFileList] = useState([]);
  const { banners, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.banner
  );
  const dispatch = useDispatch();
  const [deletedBanners, setDeletedBanners] = useState([]);

  useEffect(() => {
    dispatch(getBannersAsync());
  }, []);

  useEffect(() => {
    setFileList(banners);
  }, [banners]);

  useEffect(() => {
    if (isSuccess) {
      antMessage.success(message);
    }

    if (isError) {
      showError(antMessage, message);
    }

    dispatch(reset());
  }, [isSuccess, isError]);

  const uploadProps = {
    onRemove: (file) => {
      console.log("Removed file: ", file);
      setDeletedBanners((deletedBanners) => [...deletedBanners, file._id]);

      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([
        ...fileList,
        {
          file: file,
          url: URL.createObjectURL(file),
        },
      ]);
      return false;
    },
    fileList,
    listType: "picture-card",
  };

  function onSave() {
    const formData = new FormData();

    for (const file of fileList) {
      if (file?.file) {
        formData.append("banners", file.file);
      }
    }

    for (const bannerId of deletedBanners) {
      formData.append("deletedBanners", bannerId);
    }

    dispatch(updateBannersAsync({ formData }));
  }

  return (
    <Card title="Banners">
      <Space direction="vertical" style={{ display: "flex" }}>
        <Upload {...uploadProps}>
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
        <Button type="primary" onClick={onSave} loading={isLoading}>
          Save
        </Button>
      </Space>
    </Card>
  );
}

export default Banners;
