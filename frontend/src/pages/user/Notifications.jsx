import {
  Avatar,
  Card,
  List,
  message as antMessage,
  Spin,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import { BsBoxSeam } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getMyNotificationsAsync, reset } from "../../features/auth/authSlice";
import { showError } from "../../utils";
const { Text } = Typography;

function Notifications() {
  const dispatch = useDispatch();
  const { notifications, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(getMyNotificationsAsync());
  }, []);

  useEffect(() => {
    if (isError) {
      showError(antMessage, message);
    }

    dispatch(reset());
  }, [isError]);

  return (
    <Card title="Notifications" extra={<a href="#">Mark As Read</a>}>
      <Spin spinning={isLoading}>
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item style={{ backgroundColor: "#f6ffed" }}>
              <List.Item.Meta
                avatar={<Avatar icon={<BsBoxSeam />} />}
                title="Order Updates"
                description={
                  <>
                    <Text type="secondary">{item?.message}</Text>
                    <div>
                      <Text type="secondary">{item?.createdAt}</Text>
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Spin>
    </Card>
  );
}

export default Notifications;
