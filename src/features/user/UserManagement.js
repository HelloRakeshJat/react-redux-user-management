import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Form, Input, Modal, notification } from 'antd';
import { fetchUsers, userAdded, userUpdated, userDeleted } from './userSlice';
import { getUniqueID } from '../../components/common/HelperMethods';

const UserManagement = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const showModal = (user) => {
        setCurrentUser(user);
        setIsModalVisible(true);
        form.setFieldsValue(user ? { ...user, address: { ...user.address } } : {});
    };

    const handleOk = (values) => {
        if (currentUser) {
            dispatch(userUpdated({ ...currentUser, ...values }));
            notification.success({ message: 'User updated successfully!' });
        } else {
            dispatch(userAdded({ id: getUniqueID(6), ...values }));
            notification.success({ message: 'User added successfully!' });
        }
        setIsModalVisible(false);
        setCurrentUser(null);
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentUser(null);
        form.resetFields();
    };

    const handleDelete = (user) => {
        dispatch(userDeleted(user));
        notification.success({ message: 'User deleted successfully!' });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 150,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            sorter: (a, b) => a.phone.localeCompare(b.phone),
        },
        {
            title: 'City with Zip Code',
            key: 'address',
            render: (text, record) => (
                <span>{record.address.city} {record.address.zipcode}</span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button onClick={() => showModal(record)}>Edit</Button>
                    <Button onClick={() => handleDelete(record)}>Delete</Button>
                </>
            ),
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Button type="primary" onClick={() => showModal(null)}>Add User</Button>
            <Table
                dataSource={users}
                columns={columns}
                rowKey={record => record.id}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    }
                }}
                scroll={{ x: 'max-content', y: 400 }}
            />
            <Modal
                title={currentUser ? "Edit User" : "Add User"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    initialValues={currentUser}
                    onFinish={(values) => handleOk(values)}
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['address', 'city']} label="City" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['address', 'zipcode']} label="Zip Code" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
