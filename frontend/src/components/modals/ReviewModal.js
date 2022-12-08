import { Form, Modal, Rate, Spin, message as antMessage } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addReviewAsync,
  editReviewAsync,
  reset,
} from "../../features/review/reviewSlice";
import { showError } from "../../utils";

function ReviewModal({ open, onCancel, reviewData, type }) {
  const [form] = Form.useForm();
  const [data, setData] = useState(reviewData);

  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.review
  );

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    if (isSuccess) {
      antMessage.success(message);

      if (type === "add") {
        onCancel();
      }
    }

    dispatch(reset());
  }, [isError, isSuccess]);

  useEffect(() => {
    setData(reviewData);
    if (type === "add") {
      form.resetFields();
    }

    if (type === "edit") {
      form.setFieldsValue({
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
    }
  }, [reviewData, open]);

  return (
    <Modal
      open={open}
      title={type === "add" ? "Write A Review" : "Edit Your Review"}
      okText={type === "add" ? "Submit" : "Save"}
      cancelText="Cancel"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            if (type === "add") {
              dispatch(
                addReviewAsync({
                  orderId: data.order,
                  productId: data.product,
                  rating: values.rating,
                  comment: values.comment,
                })
              );
            }

            if (type === "edit") {
              dispatch(
                editReviewAsync({
                  reviewId: data._id,
                  rating: values.rating,
                  comment: values.comment,
                })
              );
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Spin spinning={isLoading}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="rating"
            label="Rating"
            rules={[
              {
                required: true,
                message: "Please rate this product!",
              },
            ]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comment"
            rules={[
              {
                required: true,
                message: "Please input your comment!",
              },
            ]}
          >
            <TextArea showCount maxLength={200} rows={3} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default ReviewModal;
