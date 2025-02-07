import { Form, Modal, Input, Button, Upload, message } from 'antd';
import { memo, useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getListTag, postNews } from '../../../services/api';
import Editor from './Editor';
import { set } from 'lodash';
const props = {
    multiple: true,
    accept: 'image/*',
    beforeUpload: (file) => {
        return false;
    },
    onRemove: (file) => {},
};
function ModalCreateNew({ isShowModalCreate, setIsShowModalCreate, groupId, setArticles }) {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState({});
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [listTag, setListTag] = useState([]);
    const handleCancel = () => {
        setIsShowModalCreate(false);
    };
    const handleSubmit = async () => {
        if (content === '' || title === '') {
            message.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('Images', file.originFileObj);
        });
        formData.append('GroupID', groupId);
        formData.append('Title', title);
        formData.append('Content', content);
        formData.append('PostLatitude', location.lat);
        formData.append('PostLongitude', location.lon);
        try {
            const res = await postNews(formData);
            if (res) {
                setArticles((prev) => {
                    const newState = prev.slice(1);
                    return [...res, ...newState];
                });
                setIsShowModalCreate(false);
                message.success('Tạo bài viết thành công');
                setFileList([]);
                setContent('');
                setTitle('');
            } else {
                message.error('Tạo bài viết thất bại');
            }
        } catch (error) {
            message.error('Tạo bài viết thất bại');
            console.error('Error creating article:', error);
        }
        setLoading(false);
    };
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await axios.get('http://ip-api.com/json');
                setLocation(res.data);
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };
        fetchApi();
    }, []);
    useEffect(() => {
        (async () => {
            const respone = await getListTag();
        })();
    }, []);
    return (
        <Modal
            centered={true}
            width={1000}
            footer={null}
            title="Tạo bài viết"
            open={isShowModalCreate}
            onCancel={handleCancel}
        >
            <Form.Item label="Tiêu đề :" style={{ marginTop: '20px' }}>
                <Input
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />
            </Form.Item>
            <Editor content={content} setContent={setContent} />
            <Form.Item style={{ marginTop: '20px' }} label="Hình ảnh :">
                <Upload
                    {...props}
                    listType="picture-card"
                    onPreview={() => {}}
                    fileList={fileList}
                    onChange={(newFiles) => setFileList(newFiles.fileList)}
                >
                    <UploadOutlined style={{ fontSize: '30px', opacity: '0.7' }} />
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button onClick={handleSubmit} type="primary" loading={loading} disabled={loading}>
                    Tạo bài viết
                </Button>
            </Form.Item>
        </Modal>
    );
}

export default memo(ModalCreateNew);
