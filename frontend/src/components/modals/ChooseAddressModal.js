import { Button, Empty, Modal, Radio, Space, Tag, Typography } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAddressesAsync } from "../../features/address/addressSlice";
const { Text } = Typography;

function ChooseAddressModal({ open, onCancel, defaultValue, setValue }) {
  const { addresses } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const [radioValue, setRadioValue] = useState();

  useEffect(() => {
    setRadioValue(defaultValue);
  }, [defaultValue]);

  const onChange = (e) => {
    setRadioValue(e.target.value);
  };

  useEffect(() => {
    dispatch(getAddressesAsync());
  }, []);

  const onOk = () => {
    setValue(radioValue);
    onCancel();
  };

  return (
    <Modal
      title="My Address Book"
      okText="Confirm"
      open={open}
      onOk={onOk}
      onCancel={() => {
        setRadioValue(defaultValue);
        onCancel();
      }}
      closable={false}
      centered
    >
      {addresses.length > 0 ? (
        <Radio.Group onChange={onChange} value={radioValue}>
          <Space direction="vertical">
            {addresses?.map((a) => (
              <Radio value={a._id} key={a._id}>
                <Space direction="vertical" style={{ display: "flex" }}>
                  <div>
                    <Text strong>{a?.fullName}</Text> |{" "}
                    <Text type="secondary">(+84) {a?.phoneNumber}</Text>
                  </div>

                  <Text type="secondary">{a?.address}</Text>
                  <Text type="secondary">
                    {a?.ward}, {a?.district}, {a?.province}
                  </Text>
                  <div>
                    {a.isDefault && <Tag color="green">Default</Tag>}
                    {a.label === "Home" && <Tag color="red">Home</Tag>}
                    {a.label === "Work" && <Tag color="blue">Work</Tag>}
                    {a.label === "Other" && <Tag color="gold">Other</Tag>}
                  </div>
                </Space>
              </Radio>
            ))}
            <Space>
              <Button
                size="small"
                onClick={() =>
                  window.open("/user/account/address-book", "_blank")
                }
              >
                Manage Address Book
              </Button>
            </Space>
          </Space>
        </Radio.Group>
      ) : (
        <Empty>
          <Button
            type="primary"
            ghost
            size="small"
            onClick={() => window.open("/user/account/address-book", "_blank")}
          >
            Mangage Address Book
          </Button>
        </Empty>
      )}
    </Modal>
  );
}

export default ChooseAddressModal;
